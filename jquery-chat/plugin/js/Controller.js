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

   // Controller
   $.ChatApp.Controller = function(options){
      var vent; // shared event handler
      var model, view;

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
      }

      var startPolling = function(){
         var a = model.getNewMessages({
            success: function(messages){
               _.each(messages, function(m){
                  view.loadChatMessage(m.UserToken, m);
               });

            }
         });
         setTimeout(startPolling, pollingTime);
      }

      function init(){
         vent = getEventHandler();
         registerEvents();

         //set up model and view
         model = $.ChatApp.Model(vent, options);
         view = $.ChatApp.View(vent, options);

         // get friend list
         model.getFriendList({
            success: function(friends){
               view.loadFriendList(friends);
            },
            error: function(){
               console.log("ERROR: can't load friend list");
            }
         });

         // start polling
         startPolling();
      }
      init();
   }

   $.ChatApp.start = function(options){
      options = options || {};
      var c = $.ChatApp.Controller(options);
      return c;
   }

})( jQuery);
