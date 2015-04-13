"use strict";
(function( $ ){

   $.ChatApp.View.createChatExtend = function(vent, options){
   return $.ChatApp.View.createView({
      template: $.ChatApp.Templates.chatExtend,
      init: function(){
         this.popover = this.$(".chat-extend-popover");

         // stack keep track of most recently opened chats
         this.openChats = [];
         this.closeChats = [];

         // this could be a dynamic value depending on the width of the window
         this.maxOpenChat = 3;

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
      },
      OnChatExtendItemClick: function(){

      },
      onAddChat: function(Token){
         if (this.openChats.length >= this.maxOpenChat){
            // show the option panel
            this.show();

            // hide the most recently opened chat
            var closeToken = _.last(this.openChats);
            $('#chatbox-'+closeToken).addClass('hide');
            this.openChats.pop();
            this.closeChats.push(closeToken);
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

            // move the chatbox to the very left
            var chatbox = $('#chatbox-'+openToken).removeClass('hide').detach();
            $(".chat-extend-wrap").after(chatbox);

            this.closeChats.pop();
            this.openChats.push(openToken);
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
