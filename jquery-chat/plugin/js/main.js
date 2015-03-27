(function( $ ){
   "use strict";

   var ChatApp;

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
      <div id="{{id}}" class="chatbox open">\
         <div class="chatbox-header">\
            <a class="chat-name" href="#">{{name}}</a>\
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
   <div class="message-item">\
      <p class="message-title">{{DisplayName}}:<b><small>\
      <div class="message-bubble">{{MessageContent}</div>\
   </div>';
   // create Handlebar templates
   var sideBarListItemTemplate = Handlebars.compile("<li data-token='{{Token}}'>{{DisplayName}}</li>")
   var sideBarTemplate = Handlebars.compile(sideBarHTML);
   var chatBoxTemplate = Handlebars.compile(chatBoxHTML);
   var chatBoxDialogTemplate = Handlebars.compile(chatBoxDialogHTML);

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
   var createView =  function(extendView){
      var v = $.extend({}, BaseView, extendView);
      // init functions
      v.render();
      v.registerEvents();
      v.init();
      return v;
   }

   // View
   // create individual views
   var createChatSidebar = function(vent){
      return createView({
         template: sideBarTemplate,
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
               that.list.append(sideBarListItemTemplate(friend));
            });
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onUserClick: function(evt){
            var name = $(evt.target).text();

            vent.trigger('openUserChat', name);
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
   var createChatBox = function(vent, param){
      return createView({
         template : chatBoxTemplate,
         init: function(){
            this.header = this.$('.chatbox-header');
            this.closeBtn = this.$('.close-btn');
            this.input = this.$(".chatbox-input");
         },
         events: {
            "click .chatbox-header" : "onHeaderClick",
            "click .close-btn" : "onCloseClick",
            "keydown .chatbox-input" : "onKeyDown",
         },
         toJSON: function(){
            return {
               name: param.name,
               id: param.name
            }
         },
         addMessage: function(message){
            console.log(message);
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onCloseClick: function(evt){
            vent.trigger("closeUserChat", param.name);
            evt.stopPropagation();
         },
         onKeyDown: function(evt){
            var key = evt.keyCode || evt.which,
               ENTER_KEY = 13;

            if(key == ENTER_KEY){
               this.addMessage({MessageContent: this.input.val()});
               this.input.val("");
               evt.preventDefault();
               //submit
            }

         }
      });
   }

   var View = function(vent){
      var API = {};
      var $chatDock, chatSidebar;
      var chatBoxes = {};

      var init = function(){
         // insert chat DOM
         var chatWrap = $(chatWrapperHTML);
         chatSidebar = createChatSidebar(vent);
         $chatDock = $(chatDockWrapperHTML);

         chatWrap.append(chatSidebar.$el);
         chatWrap.append($chatDock);

         $("body").append(chatWrap);
      }
      init();

      // Public functions
      API.openChatWindow = function(name){
         // create new chat box if it's not open already

         chatBoxes[name] = createChatBox(vent, {name: name});
         $chatDock.append(chatBoxes[name].$el);
      }
      API.closeChatWindow = function(name){
         $chatDock.find('#'+name).remove();
         delete chatBoxes[name];
      }
      API.loadFriendList = function(friends){
         chatSidebar.setFriendList(friends);
         chatSidebar.updateFriendList();
      }
      return API;
   }

   // Model
   var Model = function(vent){
      var API = {};


      // expost public functions for Chat Model
      API.getFriendList = function(){
         return [
            {'DisplayName': 'Jack', 'Token': '123'},
            {'DisplayName': 'Sam', 'Token': '234'},
            {'DisplayName': 'Michael', 'Token': '153'},
            {'DisplayName': 'Grace', 'Token': '732'},
            {'DisplayName': 'Jason', 'Token': '913'},
         ]
      }

      API.startChat = function(){

      }

      API.sendMessage = function(){

      }

      API.leaveChat = function(){

      }

      API.getNewMessages = function(){

      }

      return API;
   }

   // Controller
   var Controller = function(){
      var API = {};
      var vent; // shared event handler
      var model, view;

      var registerEvents = function(){

         vent.on('openUserChat', function(e, name){
            // send an open chat to model

            // open a new chat window
            view.openChatWindow(name);
         })
         vent.on('closeUserChat', function(e, name){
            view.closeChatWindow(name);
         });
      }

      var initializeChat = function(){
         // get friend list
         var friends = model.getFriendList();
         view.loadFriendList(friends);

      }

      API.init = function(){
         vent = getEventHandler();

         registerEvents();
         model = Model(vent);
         view = View(vent);

         initializeChat();
      }
      return API;
   }

   window.startChat = function(){
      var c = Controller();
      c.init();
      return c;
   }
})( jQuery);
