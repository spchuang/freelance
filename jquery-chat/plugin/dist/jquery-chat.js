/*! jquery-chat - v0.1.0 - */
(function( $ ){
   "use strict";

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
   $.ChatApp.Controller = function(){
      var vent; // shared event handler
      var model, view;
      var pollingTime = 1000;

      var registerEvents = function(){
         vent.on('openUserChat', function(e, user){
            // send an open chat to model
            model.startChat(user.Token);
            // open a new chat window
            view.openChatWindow(user);
         })

         vent.on('closeUserChat', function(e, Token){
            model.leaveChat(Token);
            view.closeChatWindow(Token);

         });

         vent.on('sendMessage', function(e, Token, message){
            model.sendMessage(Token, message);
         });
      }

      var startPolling = function(){
         var a = model.getNewMessages();
         setTimeout(startPolling, pollingTime);
      }

      function init(){
         vent = getEventHandler();
         registerEvents();

         //set up model and view
         model = $.ChatApp.Model(vent);
         view = $.ChatApp.View(vent);

         // get friend list
         model.getFriendList({
            success: function(friends){
               view.loadFriendList(friends);
            }
         });

         // start polling
         startPolling();
      }
      init();
   }

   $.ChatApp.start = function(){
      var c = $.ChatApp.Controller();
      return c;
   }

})( jQuery);

"use strict";
(function( $ ){

   // Model
   $.ChatApp.Model = function(vent){
      var API = {};
      var baseUrl = '';

      function handlePromise(promise){
         promise
            .done(function(res){
               if(callback.success) callback.success(data);
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

         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/GetContactList';
         var promise = $.get(url);
         handlePromise(promise, callback);
         */
         var data =  [
            {'DisplayName': 'Jack', 'Token': '123'},
            {'DisplayName': 'Sam', 'Token': '234'},
            {'DisplayName': 'Michael', 'Token': '153'},
            {'DisplayName': 'Grace', 'Token': '732'},
            {'DisplayName': 'Jason', 'Token': '913'},
         ]

         var promise = $.Deferred();
         promise
            .done(function(res){
               if(callback.success) callback.success(data);
            })
            .fail(function(res){
               if(callback.error) callback.error();
            });
         promise.resolve({});
      }

      API.startChat = function(Token, callback){
         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/StartChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);*/

         $("#server-events").append("[SERVER]: Start chat with user Token " + Token + "<br>");
      }

      API.sendMessage = function(Token, message){
         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SendMessage';
         var promise = $.post(url, {userToken: Token, Message: message});
         handlePromise(promise, callback);*/

         $("#server-events").append("[SERVER]: Send message to user Token " + Token + "<br>");
      }

      API.leaveChat = function(Token){
         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/LeaveChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);*/
         $("#server-events").append("[SERVER]: Leave chat with user Token " + Token + "<br>");
      }

      API.getNewMessages = function(){
         $("#server-events").append("[SERVER]: Get new messages...<br>");
         return {};
      }
      return API;
   }

})( jQuery);

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
      toJSON: function(){
         return {}
      },
      render: function(){
         this.$el = $(this.template(this.toJSON()));
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

   $.ChatApp.View.createChatSidebar = function(vent){
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
      setFriendList: function(friends){
         this.friends = friends;
      },
      updateFriendList: function(){
         this.list.empty();
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
            'DisplayName' : target.data('name'),
            'Token'  : target.data('token')
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

   $.ChatApp.View.createChatBox = function(vent, user){
      return $.ChatApp.View.createView({
         template : $.ChatApp.Templates.chatBox,
         init: function(){
            this.header = this.$('.chatbox-header');
            this.closeBtn = this.$('.close-btn');
            this.content = this.$(".chatbox-content");
            this.input = this.$(".chatbox-input");
            this.user = user;
         },
         events: {
            "click .chatbox-header" : "onHeaderClick",
            "click .close-btn" : "onCloseClick",
            "keydown .chatbox-input" : "onKeyDown",
         },
         toJSON: function(){
            return {
               DisplayName: user.DisplayName,
               Token: user.Token
            }
         },
         addMessage: function(message){
            this.content.append($.ChatApp.Templates.chatBoxDialog(_.extend(message,{
               'isTarget' : this.user.Token == message.Token
            })));

            // scroll to bottom
            this.content.slimScroll({
               scrollTo: this.content[0].scrollHeight
            });
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

"use strict";
(function( $ ){

// template
var chatWrapperHTML = '<div class="chat-wrapper"></div>';
var sideBarHTML = '\
   <div class="chat-sidebar open">\
      <div class="header"><h3>Chat List</h3></div>\
      <div class="chat-list-container">\
         <ul class="chat-list">\
         </ul>\
      </div>\
      <div class="search-bar">\
         <input class="search-input" placeholder="Name or email">\
         <span class="cancel-btn hide"><a href="#">x</a></span>\
      </div>\
   </div>';

var chatDockWrapperHTML = '<div class="chat-dock-wrapper"></div>';
var chatBoxHTML = '\
   <div id="chatbox-{{Token}}" data-token="{{Token}}" class="chatbox open">\
      <div class="chatbox-header">\
         <a class="chat-name" href="#">{{DisplayName}}</a>\
         <div class="chatbox-header-options">\
            <a class="close-btn" href="#">x</a>\
         </div>\
      </div>\
      <div class="chatbox-content"></div>\
      <div class="chatbox-footer">\
         <textarea class="chatbox-input"></textarea>\
      </div>\
   </div>';

var chatBoxDialogHTML = '\
<div class="message-item {{#if isTarget}} message-target {{/if}}">\
   <b><p class="message-from">\
      {{#if isTarget}}\
         {{DisplayName}}:\
      {{else}}\
         You:\
      {{/if}}\
   </p></b>\
   <p class="message-bubble">{{MessageContent}}</p>\
</div>';
// create Handlebar templates

$.ChatApp.Templates = {};
$.ChatApp.Templates.chatWrapperHTML = chatWrapperHTML;
$.ChatApp.Templates.chatDockWrapperHTML = chatDockWrapperHTML;
$.ChatApp.Templates.sideBarListItem = Handlebars.compile("<li data-token='{{Token}}' data-name='{{DisplayName}}'>{{DisplayName}}</li>");
$.ChatApp.Templates.sideBar = Handlebars.compile(sideBarHTML);
$.ChatApp.Templates.chatBox = Handlebars.compile(chatBoxHTML);
$.ChatApp.Templates.chatBoxDialog = Handlebars.compile(chatBoxDialogHTML);

})( jQuery);
