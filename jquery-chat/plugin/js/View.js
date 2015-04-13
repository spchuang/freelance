"use strict";
(function( $ ){

   $.ChatApp.View = function(vent, options){
      var API = {};
      var $chatDock, chatSidebar, chatExtend;
      var chatBoxes = {};

      var init = function(){
         // insert chatdock and sidebar
         var chatWrap = $($.ChatApp.Templates.chatWrapperHTML);
         chatSidebar = $.ChatApp.View.createChatSidebar(vent, options);
         $chatDock = $($.ChatApp.Templates.chatDockWrapperHTML);

         // create chat extend
         chatExtend = $.ChatApp.View.createChatExtend({chatBoxes: chatBoxes});
         $chatDock.append(chatExtend.$el);

         chatWrap.append(chatSidebar.$el);
         chatWrap.append($chatDock);

         $("body").append(chatWrap);
         chatSidebar.onRender();
      }
      init();


      // Public functions
      API.openChatWindow = function(user){
         // create and return new chat box if it's not open already
         if(chatBoxes[user.Token]){
            // move it to front and open the chatbox
            chatExtend.showChat(user.Token);
            chatBoxes[user.Token].focus();
            return;
         }

         chatExtend.onAddChat(user);

         chatBoxes[user.Token] = $.ChatApp.View.createChatBox(vent, user, options);
         $chatDock.find('.chat-extend-wrap').after(chatBoxes[user.Token].$el);
         chatBoxes[user.Token].onRender();
         return chatBoxes[user.Token];
      }
      API.loadChatMessages = function(Token, messages){
         if(_.isUndefined(chatBoxes[Token])){
            // remove the " :" from message.DisplayName
            var name = messages[0].DisplayName.replace(" :", "");
            // open chat box
            vent.trigger('openUserChat', {Token: Token, DisplayName: name});
            return;
         }

         chatBoxes[Token].addMessages(messages);
      }
      API.closeChatWindow = function(Token){
         // only a "non-hidden" chat could by closed
         $chatDock.find('#chatbox-'+Token).remove();
         delete chatBoxes[Token];

         chatExtend.onRemoveChat(Token);
      }
      API.loadFriendList = function(friends){
         chatSidebar.setFriendList(friends);
         chatSidebar.updateFriendList();
      }
      return API;
   }

})( jQuery);
