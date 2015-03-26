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
   var chatDockWrapperHTML = '<div class="chat-dock-wrapper"></div>';
   var chatBoxHTML = '\
      <div id="{{id}}" class="chatbox open">\
         <div class="chatbox-header">\
            <a class="chat-name" href="#">{{name}}</a>\
            <div class="chatbox-header-options">\
               <a class="close-btn" href="#">x</a>\
            </div>\
         </div>\
         <div class="chatbox-footer">\
            <textarea class="chatbox-input"></textarea>\
         </div>\
      </div>';
   // create Handlebar templates
   var sideBarTempalte = Handlebars.compile(sideBarHTML);
   var chatBoxTemplate = Handlebars.compile(chatBoxHTML);

   // View
   // create individual views
   var createChatSidebar = function(vent){
      var view = {
         $el : null,
         init: function(){
            this.render();
            this.header = this.$el.find('.header');
            this.list = this.$el.find('.chat-list');
            this.search = this.$el.find('.search-bar');
            this.registerEvents();

         },
         render: function(){
            this.$el = $(sideBarTempalte({}));
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
         $el : null,
         init: function(){
            this.render();
            this.header = this.$el.find('.chatbox-header');
            this.closeBtn = this.$el.find('.close-btn');

            this.registerEvents();
         },
         render: function(){
            this.$el = $(chatBoxTemplate({
               name: param.name,
               id: param.name
            }));
         },
         onHeaderClick: function(){
            this.$el.toggleClass('open');
         },
         onCloseClick: function(evt){
            console.log(vent);
            vent.trigger("closeUserChat", param.name);
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
