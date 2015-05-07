"use strict";
(function( $ ){

   $.ChatApp.View = function(vent, options){
      var API = {};
      var $chatDock, chatSidebar, chatExtend;
      var chatBoxes = {};
      var nameMapping = {};

      var init = function(){
         // insert chatdock and sidebar
         var chatWrap = $($.ChatApp.Templates.chatWrapperHTML);
         chatSidebar = $.ChatApp.View.createChatSidebar(vent, options);
         $chatDock = $($.ChatApp.Templates.chatDockWrapperHTML);

         // create chat extend
         chatExtend = $.ChatApp.View.createChatExtend(vent, {
            chatBoxes: chatBoxes, 
            nameMapping: nameMapping, 
            maxOpenChat: options.maxOpenChat
         });
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
         
            // open chat box
            vent.trigger('openUserChat', {Token: Token, DisplayName: nameMapping[Token]});
            return;
         }

         chatBoxes[Token].addMessages(messages, true);
      }
      API.closeChatWindow = function(Token){
         // only a "non-hidden" chat could by closed
         $chatDock.find('#chatbox-'+Token).remove();
         delete chatBoxes[Token];

         chatExtend.onRemoveChat(Token);
      }
      
      API.loadFriendList = function(friends){
         
         _.each(friends, function(user){
            nameMapping[user.UserToken] = user.DisplayName;
         });
         chatSidebar.setFriendList(friends);
         chatSidebar.updateFriendList();
      }
      
      API.loadWindowStatuses = function(windowStatuses) {
         // 
      
         //  load in correct order
         _.each(windowStatuses, function(w) {
            if(w.UserToken === "00000000-0000-0000-0000-000000000000") {
               chatSidebar.setMinimize(w.Minimized);  
            } else {
               vent.trigger('openUserChat', {
                  DisplayName: w.DisplayName,
                  Token: w.UserToken,
                  Minimized: w.Minimized
               });
            }
         });
      }
      
      // return an array of window statuses
      API.deserializeWindowStatuses = function(){
         // the order : list status, (0 ~ openChats-2), (closeChats), (openChats-1)

         var s = [];
         s.push({
               DisplayName: "sidebar",
               UserToken: "00000000-0000-0000-0000-000000000000",
               Minimized : chatSidebar.isMinimized()
            });
         
         for(var i = 0; i < chatExtend.openChats.length-1; i++){
            var token = chatExtend.openChats[i];
            s.push({
               DisplayName: nameMapping[token],
               UserToken: token,
               Minimized : chatBoxes[token].isMinimized()
            });
         }
         
         _.each(chatExtend.closeChats, function(token){
            s.push({
               DisplayName: nameMapping[token],
               UserToken: token,
               Minimized : chatBoxes[token].isMinimized()
            })
         });
         
         var token = _.last(chatExtend.openChats);
         if (token) {
            s.push({
               DisplayName: nameMapping[token],
               UserToken: token,
               Minimized : chatBoxes[token].isMinimized()
            });
         }
         
         return s;
      }
      
      return API;
   }

})( jQuery);
