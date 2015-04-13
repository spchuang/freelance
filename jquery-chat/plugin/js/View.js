"use strict";
(function( $ ){

   $.ChatApp.View = function(vent, options){
      var API = {};
      var $chatDock, chatSidebar;
      var chatBoxes = {};

      var init = function(){
         // insert chat DOM
         var chatWrap = $($.ChatApp.Templates.chatWrapperHTML);
         chatSidebar = $.ChatApp.View.createChatSidebar(vent, options);
         $chatDock = $($.ChatApp.Templates.chatDockWrapperHTML);

         chatWrap.append(chatSidebar.$el);
         chatWrap.append($chatDock);

         $("body").append(chatWrap);
         chatSidebar.onRender();
      }
      init();

      // Public functions
      API.openChatWindow = function(user){
         // create new chat box if it's not open already
         if(chatBoxes[user.Token]){
            // move it to front?
            return;
         }

         chatBoxes[user.Token] = $.ChatApp.View.createChatBox(vent, user, options);
         $chatDock.prepend(chatBoxes[user.Token].$el);
         chatBoxes[user.Token].onRender();

      }
      API.loadChatMessages = function(Token, messages){

         if(_.isUndefined(chatBoxes[Token])){
            // open chat box
            vent.trigger('openUserChat', Token);
            return;
         }

         chatBoxes[Token].addMessages(messages);
      }
      API.closeChatWindow = function(Token){
         $chatDock.find('#chatbox-'+Token).remove();

         delete chatBoxes[Token];
      }
      API.loadFriendList = function(friends){
         chatSidebar.setFriendList(friends);
         chatSidebar.updateFriendList();
      }
      return API;
   }

})( jQuery);
