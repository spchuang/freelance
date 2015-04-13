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
$.ChatApp.Templates.chatBox = Handlebars.compile(chatBoxHTML);
$.ChatApp.Templates.chatBoxDialog = Handlebars.compile(chatBoxDialogHTML);



})( jQuery);
