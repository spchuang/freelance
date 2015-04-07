"use strict";
(function( $ ){

   $.ChatApp.View.createChatBox = function(vent, user){
      return $.ChatApp.View.createView({
         template : $.ChatApp.Templates.chatBox,
         init: function(){
            this.header = this.$('.chatbox-header');
            this.closeBtn = this.$('.close-btn');
            this.content = this.$(".chatbox-content");
            this.input = this.$(".chatbox-input");
            this.user = user;
            this.isLoaded = false;
         },
         events: {
            "click .chatbox-header" : "onHeaderClick",
            "click .close-btn" : "onCloseClick",
            "keydown .chatbox-input" : "onKeyDown",
         },
         serializeData: function(){
            return {
               DisplayName: user.DisplayName,
               Token: user.Token,
            }
         },
         addMessages: function(messages){
            var that = this;
            this.$(".loading-sign").addClass('hide');
            _.each(messages, function(m){
               that.addMessage(m);
            });
            // scroll to bottom
            this.content.slimScroll({
               scrollTo: this.content[0].scrollHeight
            });
         },
         addMessage: function(message){
            // PROBLEM: reorder of messages (recieve a message with an earlier timestamp)

            this.content.append($.ChatApp.Templates.chatBoxDialog(_.extend(message,{
               'isTarget' : this.user.Token == message.UserToken
            })));
         },
         onRender: function(){

            this.content.slimScroll({
               height: this.content.height()
            });
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onCloseClick: function(evt){
            vent.trigger("closeUserChat", this.user.Token);
            evt.stopPropagation();
         },
         onKeyDown: function(evt){
            var key = evt.keyCode || evt.which,
               ENTER_KEY = 13;

            if(key == ENTER_KEY){
               var message = this.input.val();
               this.addMessage({MessageContent: message, DisplayName: 'Test'});
               vent.trigger("sendMessage", this.user.Token, message);
               this.input.val("");
               evt.preventDefault();
               //submit
            }

         }
      });
   }

})( jQuery);
