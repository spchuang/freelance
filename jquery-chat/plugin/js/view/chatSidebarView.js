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
         vent.trigger('updateWindowStatuses');
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
