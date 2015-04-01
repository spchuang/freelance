(function( $ ){
   "use strict";

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
   $.ChatApp.Controller = function(){
      var vent; // shared event handler
      var model, view;
      var pollingTime = 1000;

      var registerEvents = function(){
         vent.on('openUserChat', function(e, user){
            // send an open chat to model
            model.startChat(user.Token);
            // open a new chat window
            view.openChatWindow(user);
         })

         vent.on('closeUserChat', function(e, Token){
            model.leaveChat(Token);
            view.closeChatWindow(Token);

         });

         vent.on('sendMessage', function(e, Token, message){
            model.sendMessage(Token, message);
         });
      }

      var startPolling = function(){
         var a = model.getNewMessages();
         setTimeout(startPolling, pollingTime);
      }

      function init(){
         vent = getEventHandler();
         registerEvents();

         //set up model and view
         model = $.ChatApp.Model(vent);
         view = $.ChatApp.View(vent);

         // get friend list
         model.getFriendList({
            success: function(friends){
               view.loadFriendList(friends);
            }
         });

         // start polling
         startPolling();
      }
      init();
   }

   $.ChatApp.start = function(){
      var c = $.ChatApp.Controller();
      return c;
   }

})( jQuery);
