/*! jquery-chat - v0.1.0 - */
"use strict";
(function( $ ){
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
   $.ChatApp.Controller = function(options){
      var vent; // shared event handler
      var model, view;

      //default to 1000ms if it's not defined
      var pollingTime = options.pollingInterval || 1000;

      var registerEvents = function(){
         vent.on('openUserChat', function(e, user){
            // open a new chat window (which is default in loading state)
            var chatBox = view.openChatWindow(user);

            // if chatbox is new
            if(chatBox){
               model.startChat(user.Token, {
                  success: function(messages){
                     // load initial messages
                     chatBox.loadInitialMessages(messages);
                  },
                  error: function(){
                     console.log("ERROR: can't open user chat");
                  }
               });
            }
         })

         vent.on('closeUserChat', function(e, Token){
            view.closeChatWindow(Token);
            model.leaveChat(Token, {
               error: function(){
                  console.log("ERROR: can't close user chat");
               }
            });
         });

         vent.on('sendMessage', function(e, data){
            model.sendMessage(data, {
               success: function(){},
               error: function(){
                  // show error sending
                  console.log("ERROR: can't send messages");
               }
            });
         });
      }

      var startPolling = function(){
         var a = model.getNewMessages({
            success: function(messages){
               _.each(messages, function(m){
                  view.loadChatMessage(m.UserToken, m);
               });

            }
         });
         setTimeout(startPolling, pollingTime);
      }

      function init(){
         vent = getEventHandler();
         registerEvents();

         //set up model and view
         model = $.ChatApp.Model(vent, options);
         view = $.ChatApp.View(vent, options);

         // get friend list
         model.getFriendList({
            success: function(friends){
               view.loadFriendList(friends);
            },
            error: function(){
               console.log("ERROR: can't load friend list");
            }
         });

         // start polling
         startPolling();
      }
      init();
   }

   $.ChatApp.start = function(options){
      options = options || {};
      var c = $.ChatApp.Controller(options);
      return c;
   }

})( jQuery);

"use strict";
(function( $ ){

   // Model
   $.ChatApp.Model = function(vent, options){
      var API = {};

      var baseUrl = options.baseUrl || "" ;
      if (!baseUrl) {
         console.log("[ERROR]: Model base url is not specified");
      }

      function handlePromise(promise, callback){
         promise
            .done(function(res){
               if(callback.success) callback.success(res);
            })
            .fail(function(res){
               if(callback.error) callback.error();
            });
      }

      // expost public functions for Chat Model
      // All get functions return a promise (waiting on server response)
      // callback takes in {success, error}
      API.getFriendList = function(callback){
         $("#server-events").append("[SERVER]: Get friend list<br>");


         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/GetContactList';
         var promise = $.get(url);
         handlePromise(promise, callback);

         /*
         var data = [
             {
                 "DisplayName": "Gomer Pyle",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c2",
             },
             {
                 "DisplayName": "Test 1",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c3",
             },
             {
                 "DisplayName": "Test 2",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c4",
             },
             {
                 "DisplayName": "Test 3",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c5",
             },
             {
                 "DisplayName": "Test 4",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c6",
             },
             {
                 "DisplayName": "Test 5",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c7",
             },
             {
                 "DisplayName": "Test 6",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c8",
             },
             {
                 "DisplayName": "Test 7",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c9",
             },
         ]

         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);*/
      }

      API.startChat = function(Token, callback){
         $("#server-events").append("[SERVER]: Start chat with user Token " + Token + "<br>");
         // Start a chat, and server returns a list of messages

         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/StartChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);

         /*
         var data = [
            {
                "DisplayName": "Gomer Pyle :",
                "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c2",
                "Message": "TEST.",
            },
         ];
         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);*/
      }

      API.sendMessage = function(data, callback){
         $("#server-events").append("[SERVER]: Send message to user Token " + data.Token + "<br>");

         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SendChatMessage';
         var promise = $.post(url, {UserToken: data.Token, Message: data.Message});
         handlePromise(promise, callback);
      }

      API.leaveChat = function(Token, callback){
         $("#server-events").append("[SERVER]: Leave chat with user Token " + Token + "<br>");
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/LeaveChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);
      }

      var lastCheckedTime = new Date();
      API.getNewMessages = function(callback){
         $("#server-events").append("[SERVER]: Get new messages...<br>");

         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/CheckForNewMessages';
         var promise = $.get(url, {lastChecked: lastCheckedTime.toISOString()});

         // current time as last checked time
         lastCheckedTime = new Date();

         handlePromise(promise, callback);
         /*
         var data = [

            {
                "DisplayName": "Gomer Pyle :",
                "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c2",
                "Message": "TEST.",
            },
         ];
         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);*/
      }
      return API;
   }

})( jQuery);

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
      API.loadChatMessage = function(Token, message){
         if(_.isUndefined(chatBoxes[Token])){
            // remove the " :" from message.DisplayName
            var name = message.DisplayName.replace(" :", "");
            // open chat box
            vent.trigger('openUserChat', {Token: Token, DisplayName: name});
            return;
         }

         chatBoxes[Token].addMessages(message);
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

"use strict";
(function( $ ){

   // a basic view that allows simpler event registration
   var BaseView = {
      template: Handlebars.compile(""),
      $el: null,
      events: {
         /*
         "click .test" : "callback"
         */
      },
      $: function(selector){
            return this.$el.find(selector);
      },
      init: function(){},
      serializeData: function(){
         return {}
      },
      render: function(){
         this.$el = $(this.template(this.serializeData()));
      },
      onRender: function(){},
      registerEvents: function(){
         var that = this;
         // value is function name, key is event name
         _.each(this.events, function(val, key){
            var func = that[val];
            var evtName = key.split(" ")[0];
            var selector = key.split(" ")[1];

            // validate if funciton exists
            if(_.isFunction(func)){
               // attach function as event handler and maintain original scope
               that.$el.on(evtName, selector, $.proxy(func, that));
            }else {
               console.log("[ERROR]: " + func + " is not a function");
            }
         })
      },
   }
   // setup extend function
   $.ChatApp.View.createView =  function(extendView){
      var v = $.extend({}, BaseView, extendView);
      v.render();
      v.init();
      // init functions
      v.registerEvents();
      return v;
   }


})( jQuery);

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

"use strict";
(function( $ ){

   $.ChatApp.View.createChatSidebar = function(vent, options){
   return $.ChatApp.View.createView({
      template: $.ChatApp.Templates.sideBar,
      init: function(){
         this.header = this.$el.find('.header');
         this.list = this.$el.find('.chat-list');
         this.searchInput = this.$el.find('.search-bar .search-input');
         this.friends = [];
      },
      events: {
         "click .header" : "onHeaderClick",
         "click .chat-list>li" : "onUserClick",
         "keyup .search-input" : "onSearchChange",
         "click .cancel-btn": "onCancelClick"
      },
      serializeData: function(){
         return {
            loadingSign: options.loadingSign
         }
      },
      setFriendList: function(friends){
         this.friends = friends;
      },
      updateFriendList: function(){
         this.list.empty();
         this.$(".loading-sign").addClass('hide');
         // get filtered frind list
         var searchString = this.searchInput.val().toLowerCase();

         var filtered = _.filter(this.friends, function(friend){
            return friend['DisplayName'].toLowerCase().indexOf(searchString) >= 0;
         });

         var that = this;
         _.each(filtered, function(friend){
            that.list.append($.ChatApp.Templates.sideBarListItem(friend));
         });
      },
      onRender: function(){
         this.list.slimScroll({
            height: this.list.height()
         });
      },
      onHeaderClick: function(){
         this.$el.toggleClass('open');
      },
      onUserClick: function(evt){
         var target = $(evt.target);

         vent.trigger('openUserChat', {
            DisplayName: target.data('name'),
            Token: target.data('token')
         });
      },
      onSearchChange: function(evt){
         // show cancel button
         if (this.searchInput.val() != ""){
            this.$(".cancel-btn").removeClass('hide');
         } else {
            this.$(".cancel-btn").addClass('hide');
         }
         this.updateFriendList();
      },
      onCancelClick: function(){
         this.searchInput.val("");
         this.onSearchChange();
      }
   });
}

})( jQuery);

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
         focus:function(){
            this.$el.addClass('open');
            this.input.focus();
         },
         onRender: function(){
            this.content.slimScroll({
               height: this.content.height()
            });
            this.focus();
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

"use strict";
(function( $ ){

// template
var chatWrapperHTML = '<div class="chat-wrapper"></div>';
var sideBarHTML = '\
   <div class="chat-sidebar open">\
      <div class="header"><h3>Chat List</h3></div>\
      <div class="chat-list-container">\
         <img class="loading-sign" src="{{loadingSign}}">\
         <ul class="chat-list">\
         </ul>\
      </div>\
      <div class="search-bar">\
         <input class="search-input" placeholder="Search for name">\
         <span class="cancel-btn hide"><a href="#">x</a></span>\
      </div>\
   </div>';

var chatDockWrapperHTML = '<div class="chat-dock-wrapper"></div>';

var chatExtendHTML = '\
   <div class="chat-extend-wrap hide">\
      <div class="chat-extend-popover"></div>\
      <div class="chat-extend-btn"><a href="#">More</a></div>\
   </div>';

var chatBoxHTML = '\
   <div id="chatbox-{{Token}}" data-token="{{Token}}" class="chatbox open">\
      <div class="chatbox-header">\
         <a class="chat-name" href="#">{{DisplayName}}</a>\
         <div class="chatbox-header-options">\
            <a class="close-btn" href="#">x</a>\
         </div>\
      </div>\
      <div class="chatbox-content">\
         <img class="loading-sign" src="{{loadingSign}}">\
      </div>\
      <div class="chatbox-footer">\
         <textarea class="chatbox-input"></textarea>\
      </div>\
   </div>';

var chatBoxDialogHTML = '\
<div class="message-item {{#if isTarget}} message-target {{/if}}">\
   <b><p class="message-from">\
      {{#if isTarget}}\
         {{DisplayName}}\
      {{else}}\
         You:\
      {{/if}}\
   </p></b>\
   <p class="message-bubble">{{Message}}</p>\
   <span class="timeago" title="{{SentOn}}"></span>\
</div>';
// create Handlebar templates

$.ChatApp.Templates = {};
$.ChatApp.Templates.chatWrapperHTML = chatWrapperHTML;
$.ChatApp.Templates.chatDockWrapperHTML = chatDockWrapperHTML;
$.ChatApp.Templates.sideBarListItem = Handlebars.compile("<li data-token='{{UserToken}}' data-name='{{DisplayName}}'>{{DisplayName}}</li>");
$.ChatApp.Templates.sideBar = Handlebars.compile(sideBarHTML);
$.ChatApp.Templates.chatExtend = Handlebars.compile(chatExtendHTML);
$.ChatApp.Templates.chatExtendItem = Handlebars.compile("<div class='chat-extend-item' data-token='{{Token}}'>{{DisplayName}}</div>");

$.ChatApp.Templates.chatBox = Handlebars.compile(chatBoxHTML);
$.ChatApp.Templates.chatBoxDialog = Handlebars.compile(chatBoxDialogHTML);



})( jQuery);
