"use strict";
(function( $ ){

   $.ChatApp.View.createChatExtend = function(options){
   return $.ChatApp.View.createView({
      template: $.ChatApp.Templates.chatExtend,
      init: function(){
         // have a reference to View's chatBoxes so we can access its functions
         this.chatBoxes = options.chatBoxes;
         this.popover = this.$(".chat-extend-popover");

         // stack keep track of most recently opened chats
         this.openChats = [];
         this.closeChats = [];

         // maps token to name
         this.nameMapping = {};

         // this could be a dynamic value depending on the width of the window
         this.maxOpenChat = 3;

         // close the popover when clicked outside
         $(document).click(function(event) {
            if(!$(event.target).closest('.chat-extend-popover').length) {
               if($('.chat-extend-popover').is(":visible")) {
                  $('.chat-extend-popover').removeClass('open');
               }
            }
         })
      },
      events: {
         "click .chat-extend-btn" : "onBtnClick",
         "click .chat-extend-item": "OnChatExtendItemClick"
      },
      hide: function(){
         this.$el.addClass('hide');
      },
      show: function(){
         this.$el.removeClass('hide');
      },
      reRender: function(){
         // rerender the list
         this.popover.empty();
         var that = this;
         _.each(this.closeChats, function(Token){
            var data = {
               Token: Token,
               DisplayName: that.nameMapping[Token]
            }
            that.popover.append($.ChatApp.Templates.chatExtendItem(data));
         });
      },
      OnChatExtendItemClick: function(evt){
         var openToken = $(evt.target).data('token');
         this.popover.toggleClass('open');
         this.showChat(openToken);
         this.chatBoxes[openToken].focus();
      },
      showChat: function(Token){
         // if the chat is in closeChats, open it
         var index = _.indexOf(this.closeChats, Token);

         if (index != -1){
            this.hideMostRecentOpenChat();
            this.showClosedChat(Token);
            this.closeChats.splice(index, 1);
         }
         this.reRender();
      },
      hideMostRecentOpenChat: function(){
         // hide the most recently opened chat
         var closeToken = this.openChats.pop();
         $('#chatbox-'+closeToken).addClass('hide');
         this.closeChats.push(closeToken);
      },
      showClosedChat: function(Token){
         // move the chatbox to the very left
         var chatbox = $('#chatbox-'+Token).removeClass('hide').detach();
         $(".chat-extend-wrap").after(chatbox);
         this.openChats.push(Token);
      },
      onAddChat: function(user){
         var Token = user.Token;
         this.nameMapping[Token] = user.DisplayName;

         if (this.openChats.length >= this.maxOpenChat){
            // show the option panel
            this.show();
            this.hideMostRecentOpenChat();
         }
         this.openChats.push(Token);
         this.reRender();
      },
      onRemoveChat: function(Token){
         var index = _.indexOf(this.openChats, Token);
         this.openChats.splice(index, 1);

         // show the chatbox that was most recently hidden, and move it to the very left
         if (this.closeChats.length > 0){
            var openToken = _.last(this.closeChats);
            this.showClosedChat(openToken);
            this.closeChats.pop();

         }
         if (this.closeChats.length == 0){
            this.hide();
         }

         this.reRender();
      },
      onBtnClick: function(evt){
         this.popover.toggleClass('open');
         evt.stopPropagation();
      },
   });
}

})( jQuery);
