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
   var chatWrapperTemplate = '<div class="chat-wrapper"></div>';
   var sideBarTemplate = '\
      <div class="chat-sidebar">\
         <div class="header"><h3>Chat List</h3></div>\
         <div class="chat-list-container">\
            <ul class="chat-list">\
               <li>Sam</li>\
               <li>Michael</li>\
               <li>Jack</li>\
               <li>Jason</li>\
            </ul>\
         </div>\
         <div class="search-bar">\
         </div>\
      </div>';
   var chatDockWrapperTemplate = '<div class="chat-dock-wrapper"></div>';
   var chatBoxTemplate = '\
      <div class="chatbox open">\
         <div class="chatbox-header">\
            <a class="chat-name" href="#">Jack</a>\
            <div class="chatbox-header-options">\
               <a class="close-btn" href="#">x</a>\
            </div>\
         </div>\
         <div class="chatbox-footer">\
            <textarea class="chatbox-input"></textarea>\
         </div>\
      </div>';

   // View
   // create individual views
   var createChatSidebar = function(vent){

      var view = {
         $el : $(sideBarTemplate),
         init: function(){
            this.header = this.$el.find('.header');
            this.list = this.$el.find('.chat-list');
            this.search = this.$el.find('.search-bar');
            this.registerEvents();
         },
         updateList: function(){
            // update user list
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onUserClick: function(evt){
            var name = $(evt.target).text();

            vent.trigger('openUserChat', name);
         },
         registerEvents: function(){
            // maintain original scope (this)
            this.header.on('click', $.proxy(this.onHeaderClick, this));

            this.list.on('click', 'li', $.proxy(this.onUserClick, this));
         }
      }
      view.init();
      return view;
   }
   var createChatBox = function(vent, param){
      var view = {
         $el : $(chatBoxTemplate),
         init: function(){
            this.name = param.name;
            this.header = this.$el.find('.chatbox-header');
            this.closeBtn = this.$el.find('.close-btn');

            this.registerEvents();
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onCloseClick: function(evt){
            console.log(vent);
            vent.trigger('closeUserChat', this.name);
            evt.stopPropagation();
         },
         registerEvents: function(){
            // maintain original scope (this)
            this.header.on('click', $.proxy(this.onHeaderClick, this));
            this.closeBtn.on('click', $.proxy(this.onCloseClick, this));
         }
      }
      view.init();
      return view;
   }

   var View = function(vent){
      var API = {};
      var $chatDock, chatSidebar;
      var chatBoxes = {};

      var init = function(){
         // insert chat DOM
         var chatWrap = $(chatWrapperTemplate);
         chatSidebar = createChatSidebar(vent);
         $chatDock = $(chatDockWrapperTemplate);

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

         console.log("close chat");
      }
      return API;
   }



   // Model
   var Model = function(vent){
      var API = {};


      // expost public functions for Chat Model
      API.getFriendList = function(){


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

      API.init = function(){
         vent = getEventHandler();

         registerEvents();
         model = Model(vent);
         view = View(vent);
      }
      return API;
   }

   window.startChat = function(){
      var c = Controller();
      c.init();
      return c;
   }
})( jQuery);
