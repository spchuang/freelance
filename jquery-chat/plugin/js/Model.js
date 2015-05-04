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
             {
                 "DisplayName": "Test 8",
                 "UserToken": "5ab24a95-ca18-4566-ace7-17b1f0b514c8",
             },
             {
                 "DisplayName": "Test 9",
                 "UserToken": "5ab64a15-ca18-4566-ace7-17b1f0b514c9",
             },
             {
                 "DisplayName": "Test 10",
                 "UserToken": "5lb64a95-ca18-4566-ace7-17b1f0b514c8",
             },
             {
                 "DisplayName": "Test 11",
                 "UserToken": "5aj64a95-ca18-4566-ace7-17b1f0b514c9",
             },
             {
                 "DisplayName": "Test 12",
                 "UserToken": "5abn4a95-ca18-4566-ace7-17b1f0b514c8",
             },
             {
                 "DisplayName": "Test 13",
                 "UserToken": "5aba4a95-ca18-4566-ace7-17b1f0b514c9",
             },
             {
                 "DisplayName": "Test 14",
                 "UserToken": "5abs4a95-ca18-4566-ace7-17b1f0b514c8",
             },
             {
                 "DisplayName": "Test 15",
                 "UserToken": "5ab64f95-ca18-4566-ace7-17b1f0b514c9",
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
      
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SendChatMessage';
         var promise = $.post(url, {UserToken: data.Token, Message: data.Message});
         handlePromise(promise, callback);
      }

      API.leaveChat = function(Token, callback){
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/LeaveChat';
         var promise = $.get(url, { userToken: Token })
         handlePromise(promise, callback);
      }

      API.getNewMessages = function(callback){
         var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/CheckForNewMessages';
         var promise = $.get(url);

         handlePromise(promise, callback);

         /*
         var data = [{"DisplayName":"Me :","UserToken":"5ab64a95-ca18-4566-ace7-17b1f0b514c2","Direction":1,"Interaction":1,"Message":"Sam Chuang wants to talk with you.","SentOn":"2015-04-13T17:44:26.047Z"}];
         var promise = $.Deferred();
         handlePromise(promise, callback);

         // delay
         setTimeout(
           function(){
             promise.resolve(data);
          }, 1000);*/
      }
      
      API.getWindowStatuses = function(callback){
          var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/RetrieveWindowStatuses';
          var promise = $.get(url);
          
          handlePromise(promise, callback);
          
          /*var data =[{"DisplayName":"Test 2","UserToken":"5ab64a95-ca18-4566-ace7-17b1f0b514c4","Minimized":true},{"DisplayName":"Test 3","UserToken":"5ab64a95-ca18-4566-ace7-17b1f0b514c5","Minimized":false},{"DisplayName":"Test 9","UserToken":"5ab64a15-ca18-4566-ace7-17b1f0b514c9","Minimized":false},{"DisplayName":"Test 7","UserToken":"5ab64a95-ca18-4566-ace7-17b1f0b514c9","Minimized":false},{"DisplayName":"Test 11","UserToken":"5aj64a95-ca18-4566-ace7-17b1f0b514c9","Minimized":false},{"DisplayName":"Test 10","UserToken":"5lb64a95-ca18-4566-ace7-17b1f0b514c8","Minimized":false}];
         var promise = $.Deferred();
         handlePromise(promise, callback);
         
         // delay
         setTimeout(
            function(){
               promise.resolve(data);
         }, 0);*/
          
      }
      
      API.updateWindowStatuses = function(windowStatuses, callback){ 
          var url = baseUrl + '/DesktopModules/LifeWire/Services/API/Chat/SaveWindowStatuses';
          var promise = $.post(url, {windowStatuses: windowStatuses});
          handlePromie(promise, callback);
      }
      return API;
   }

})( jQuery);
