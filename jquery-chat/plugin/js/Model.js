"use strict";
(function( $ ){

   // Model
   $.ChatApp.Model = function(vent){
      var API = {};
      var baseUrl = '';

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
         /*
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/GetContactList';
         var promise = $.get(url);
         handlePromise(promise, callback);*/


         var data =  [
            {'DisplayName': 'Jack', 'Token': '123'},
            {'DisplayName': 'Sam', 'Token': '234'},
            {'DisplayName': 'Michael', 'Token': '153'},
            {'DisplayName': 'Grace', 'Token': '732'},
            {'DisplayName': 'Jason', 'Token': '913'},
         ]

         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);
      }

      API.startChat = function(Token, callback){
         $("#server-events").append("[SERVER]: Start chat with user Token " + Token + "<br>");
         // Start a chat, and server returns a list of messages

         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/StartChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);*/

         var data = [
            {
               'User': "Test",
               "UserToken": "000",
               "Message": "This is so cool"
            },
            {
               'User': "Jack",
               "UserToken": "123",
               "Message": "This is so cool"
            },
            {
               'User': "Jack",
               "UserToken": "000",
               "Message": "This is so cool"
            },
            {
               'User': "Test",
               "UserToken": "123",
               "Message": "This is so cool"
            }
         ]
         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);
      }

      API.sendMessage = function(Token, message, callback){
         /*var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SendMessage';
         var promise = $.post(url, {UserToken: Token, Message: message});
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
