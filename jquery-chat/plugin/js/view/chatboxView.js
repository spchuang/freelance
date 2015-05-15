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
            
            
            // register textbox height change
            /*
             observe(text, 'change',  resize);
             observe(text, 'cut',     delayedResize);
             observe(text, 'paste',   delayedResize);
             observe(text, 'drop',    delayedResize);
             observe(text, 'keydown', delayedResize);
             */
         },
         events: {
            "click" : "onChatBoxClick",
            "click .chatbox-header" : "onHeaderClick",
            "click .close-btn" : "onCloseClick",
            "keydown .chatbox-input" : "onKeyDown",
            
            "change .chatbox-input" : "textBoxResize",
            "keydown.resize .chatbox-input" : "delayedResize",
            "cut .chatbox-input" : "delayedResize",
            "paste .chatbox-input" : "delayedResize",
            "drop .chatbox-input" : "delayedResize"
         },
         delayedResize: function(){
            window.setTimeout($.proxy(this.textBoxResize, this), 0);
         },
         textBoxResize: function(){
         
            // expand only to 4 extra rows
            this.input.css('height', 'auto');
            var newHeight = this.input.prop('scrollHeight');
            
            newHeight = Math.max(newHeight, 30);
            
            // set proper height
            if ((newHeight - 30)/15 > 4) {
               newHeight = 90;
            } 
            
            // change textbox height
            this.input.css('height', newHeight+'px');
            this.input.css('min-height', newHeight+'px');
            this.input.parent().css('height', (newHeight+10) +'px');
            
            // change content height (default 260)
            var newContentHeight = 260 - (newHeight - 30);
            this.content.css('height', newContentHeight + 'px');
            //this.content.parent().css('height', newContentHeight + 'px');
         },
         serializeData: function(){
            return {
               DisplayName: user.DisplayName,
               Token: user.Token,
               loadingSign: options.loadingSign
            }
         },
         isMinimized: function(){
           return !this.$el.hasClass('open');
         },
         loadInitialMessages: function(messages){
            this.isLoaded = true;
            this.addMessages(messages, false);
         },
         onChatBoxClick: function(){
            vent.trigger("chatBoxClicked");
         },
         addMessages: function(messages, playSound){
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

            // remove duplicate
            newMessagesList = _.uniq(newMessagesList, function(item){
               return item.SentOn;
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
            
            // Calculate number of new messages
            var numNewMessages = newMessagesList.length - this.messages.length;
            if(playSound && numNewMessages > 0) {
                vent.trigger('playNotification');
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
         focus:function(){
            this.$el.addClass('open');
            this.input.focus();
         },
         onRender: function(){
            this.content.slimScroll({
               height: this.content.height()
            });
            this.focus();
            
            // set initial window minimize state
            if (user.Minimized == true) {
               this.$el.removeClass('open');
            }
            
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
            vent.trigger('updateWindowStatuses');
         },
         onCloseClick: function(evt){
            // dispose timeago to avoid memory leak
            _.each(this.messagesDom, function(m){
               m.find('.timeago').timeago('dispose');
            })

            vent.trigger("closeUserChat", this.user.Token);
            vent.trigger('updateWindowStatuses');
            
            evt.stopPropagation();
         },
         onKeyDown: function(evt){
            var key = evt.keyCode || evt.which,
               ENTER_KEY = 13;
            
               
            // Enter was pressed without shift key
            if(key == ENTER_KEY && !evt.shiftKey){
               var message = this.input.val();
               //this.addMessage({MessageContent: message, DisplayName: 'Test'});
               vent.trigger("sendMessage", {
                  Token: this.user.Token,
                  Message: message
               });
               this.input.val("");
               evt.preventDefault();
               //submit
            }
         }
      });
   }

})( jQuery);
