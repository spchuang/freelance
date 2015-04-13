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
                 "IdField1": "Gomer",
                 "IdField2": "Pyle",
                 "DisplayName": "Gomer Pyle",
                 "UserToken": "5ab64a95-ca18-4566-ace7-17b1f0b514c2",
                 "GroupName": "Test Group",
                 "TimeZone": "Mountain Standard Time",
                 "Country": "United States",
                 "EmailAddress": "chaitanya@marvici.com",
                 "MobileNumber": "15126085937"
             }
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
                "Direction": 2,
                "Interaction": 1,
                "Message": "hi",
                "SentOn": "2015-04-12T00:49:39.397"
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

      API.sendMessage = function(Token, message, callback){
         $("#server-events").append("[SERVER]: Send message to user Token " + Token + "<br>");

         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SendMessage';
         var promise = $.post(url, {UserToken: Token, Message: message});
         handlePromise(promise, callback);
      }

      API.leaveChat = function(Token){
         $("#server-events").append("[SERVER]: Leave chat with user Token " + Token + "<br>");
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/LeaveChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);
      }

      var lastCheckedTime = new Date();
      API.getNewMessages = function(callback){
         $("#server-events").append("[SERVER]: Get new messages...<br>");

         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/CheckForNewMessages';
         var promise = $.post(url, {lastChecked: lastCheckedTime.toISOString()});

         // current time as last checked time
         lastCheckedTime = new Date();

         handlePromise(promise, callback);
      }
      return API;
   }

})( jQuery);
