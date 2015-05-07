"use strict";


(function( $ ){
   $.ChatApp = {};

   // Simple jquery pub/sub handler
   var getEventHandler = function(){
      var o = $({}), e = {};

      e.on = function() {
         o.on.apply(o, arguments);
      };

      e.off = function() {
         o.off.apply(o, arguments);
      };

      e.trigger = function() {
         o.trigger.apply(o, arguments);
      };
      return e;
   }
   
   $.ChatApp.notificationSound = function(url){
      var s = {
         audio: null,
         init: function(){
            this.audio = new Audio(url);

            //this.audio.play();
         },
         play: function(){
            this.audio.play();
         }
      };
      s.init();
      return s;
   }

   // Controller
   $.ChatApp.Controller = function(options){
      var vent; // shared event handler
      var model, view;
      var sound;

      //default to 1000ms if it's not defined
      var pollingTime = options.pollingInterval || 1000;

      var registerEvents = function(){
         vent.on('openUserChat', function(e, user){
            // open a new chat window (which is default in loading state)
            var chatBox = view.openChatWindow(user);

            // if chatbox is new
            if(chatBox){
               model.startChat(user.Token, {
                  success: function(messages){
                     // load initial messages
                     chatBox.loadInitialMessages(messages);
                  },
                  error: function(){
                     console.log("ERROR: can't open user chat");
                  }
               });
            }
         })

         vent.on('closeUserChat', function(e, Token){
          //vent.trigger('updateWindowStatuses');
            view.closeChatWindow(Token);
           
            model.leaveChat(Token, {
               error: function(){
                  console.log("ERROR: can't close user chat");
               }
            });
            
         });

         vent.on('sendMessage', function(e, data){
            model.sendMessage(data, {
               success: function(){},
               error: function(){
                  // show error sending
                  console.log("ERROR: can't send messages");
               }
            });
         });
         
         vent.on('playNotification', function(e){
            sound.play();
            flashTitle("New Messages");
         });
         
         vent.on('chatBoxClicked', function(e){
            // cancel the browser flash
            cancelFlashTitle();
         });
         
         vent.on('updateWindowStatuses', function(e, statuses) {
            /*
                Update under the following circumstances
                - open new chat
                - minimize/expand chat window
                - click on a chat in extend
                - close chat
                
                Array(statues) => {
                    UserToken
                    Minimized
                    DisplayName
                }
            */

            var windowStatuses = view.deserializeWindowStatuses();
            model.updateWindowStatuses(windowStatuses);
         });
      }

      var i = 0;
      var startPolling = function(){
         var a = model.getNewMessages({
            success: function(messages){
               // sort each messages based on Token
               var chats = {};

               // group messages based on chat Token
               _.each(messages, function(m){
                  if (!chats[m.UserToken]){
                     chats[m.UserToken] = [m];
                  } else {
                     chats[m.UserToken].push(m);
                  }
               });

               _.each(chats, function(messages, Token){
                  view.loadChatMessages(Token, messages);
               });
            }
         });
         setTimeout(startPolling, pollingTime);
      }

      function init(){
         vent = getEventHandler();
         registerEvents();
         
         sound = $.ChatApp.notificationSound(options.notificationSound);

         //set up model and view
         model = $.ChatApp.Model(vent, options);
         view = $.ChatApp.View(vent, options);
         
         
         // get window statuses
         model.getWindowStatuses({
            success: function(windowStatuses) {
               
               view.loadWindowStatuses(windowStatuses);
               // get friend list
               model.getFriendList({
                  success: function(friends){
                  
                     view.loadFriendList(friends);
                  },
                  error: function(){
                     console.log("ERROR: can't load friend list");
                  }
               });
            },
            error: function(){
               console.log("ERROR: can't load window statuses");
            }
         });

         
         
         
         // start polling
         startPolling();
      }
      init();
   }

   $.ChatApp.start = function(options){
      options = options || {};
      options.maxOpenChat = options.maxOpenChat || 3;
      var c = $.ChatApp.Controller(options);
      return c;
   }

})( jQuery);
