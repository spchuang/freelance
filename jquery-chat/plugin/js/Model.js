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
