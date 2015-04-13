"use strict";
(function( $ ){

   $.ChatApp.View.createChatBox = function(vent, user, options){
      return $.ChatApp.View.createView({
         template : $.ChatApp.Templates.chatBox,
         init: function(){
            this.header = this.$('.chatbox-header');
            this.closeBtn = this.$('.close-btn');
            this.content = this.$(".chatbox-content");
            this.input = this.$(".chatbox-input");
            this.user = user;
            this.isLoaded = false;
            this.messages = [];
            this.messagesDom = [];
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
               loadingSign: options.loadingSign
            }
         },
         loadInitialMessages: function(messages){
            this.isLoaded = true;
            this.addMessages(messages);
         },
         addMessages: function(messages){
            var that = this;
            // ignore all messages until the chat box is loaded first
            if(!this.isLoaded){
               return;
            }

            // add date column for new messages
            _.each(messages, function(m){
               m.time = new Date(m.SentOn);
            });

            // add messages to the current list of messages
            var newMessagesList = this.messages.concat(messages);

            // sort the messages by time
            newMessagesList.sort(function (a, b) {
               return a.time - b.time;
            });

            this.$(".loading-sign").addClass('hide');

            // insert new messages at correct location (based on time)
            var i = 0, j =0;
            var numInserted = 0;
            for(;j < newMessagesList.length; j++) {
               if (_.isUndefined(this.messages[i])){
                  // this means we are adding to the end
                  var m = this.createMessage(newMessagesList[j]);
                  this.content.append(m);
                  m.find('.timeago').timeago();
                  this.messagesDom.push(m);
               } else {
                  if (this.messages[i].time == newMessagesList[j].time){
                     i++;
                  } else if(this.messages[i].time > newMessagesList[j].time){
                     // add a new message after (i - 1)th message
                     var m = this.createMessage(newMessagesList[j]);

                     var insertAfter = this.messagesDom[i - 1 + numInserted];
                     if(_.isUndefined(insertAfter)){
                        // inserting at the beginning of the list
                        this.content.prepend(m);
                     } else {
                        this.messagesDom[i - 1 + numInserted].after(m);
                     }

                     numInserted++;
                     m.find('.timeago').timeago();

                     // insert new dom to ith location
                     this.messagesDom.splice(i, 0, m);
                  }
               }
            }

            this.messages = newMessagesList;

            // scroll to bottom
            this.content.slimScroll({
               scrollTo: this.content[0].scrollHeight
            });
         },
         createMessage: function(message){
            return $($.ChatApp.Templates.chatBoxDialog(_.extend(message,{
               'isTarget' : message.Direction == 2
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
            // dispose timeago to avoid memory leak
            _.each(this.messagesDom, function(m){
               m.find('.timeago').timeago('dispose');
            })

            vent.trigger("closeUserChat", this.user.Token);
            evt.stopPropagation();
         },
         onKeyDown: function(evt){
            var key = evt.keyCode || evt.which,
               ENTER_KEY = 13;

            if(key == ENTER_KEY){
               var message = this.input.val();
               //this.addMessage({MessageContent: message, DisplayName: 'Test'});
               vent.trigger("sendMessage", this.user.Token, message);
               this.input.val("");
               evt.preventDefault();
               //submit
            }

         }
      });
   }

})( jQuery);
