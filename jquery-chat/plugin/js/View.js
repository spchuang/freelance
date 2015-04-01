"use strict";
(function( $ ){

   $.ChatApp.View = function(vent){
      var API = {};
      var $chatDock, chatSidebar;
      var chatBoxes = {};

      var init = function(){
         // insert chat DOM
         var chatWrap = $($.ChatApp.Templates.chatWrapperHTML);
         chatSidebar = $.ChatApp.View.createChatSidebar(vent);
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

         chatBoxes[user.Token] = $.ChatApp.View.createChatBox(vent, user);
         $chatDock.prepend(chatBoxes[user.Token].$el);
         chatBoxes[user.Token].onRender();

         /*
         chatBoxes[user.Token].addMessage({
            'DisplayName': "Jack",
            "Token": user.Token,
            "MessageContent": "skjfa;jdf;alksdjf"
         });

         chatBoxes[user.Token].addMessage({
            'DisplayName': "Test",
            "Token": "000",
            "MessageContent": "This is so cool"
         });

         chatBoxes[user.Token].addMessage({
            'DisplayName': "Jack",
            "Token": user.Token,
            "MessageContent": "skjfa;jdf;alksdjf"
         });
         chatBoxes[user.Token].addMessage({
            'DisplayName': "Jack",
            "Token": user.Token,
            "MessageContent": "skjfa;jdf;alksdjf"
         });
         chatBoxes[user.Token].addMessage({
            'DisplayName': "Jack",
            "Token": user.Token,
            "MessageContent": "skjfa;jdf;alksdjf"
         });*/
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
