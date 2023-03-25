'use strict';

/**
 * Givme API Service
 * @param $q
 * @param $http
 * @param $cordovaOauth
 * @param Facebook
 * @param gmAPIServerIP
 * @param FacebookAppID
 * @returns {{login: Function}}
 * @constructor
 */
function GmAPI($q, $http, $cordovaOauth, $window, Facebook, gmAPIServerIP, FacebookAppID, $state, $ionicPopover) {

    this.apiKey = '';
    this.currentPokeId = 0;

    this.clearApiKey = function() {
      $window.localStorage.removeItem("givme_apikey");
    }

    this.confirmAndSetValidApi = function() {
      if (!$window.localStorage["givme_apikey"]) {
        return;
      }

      var keyDetails = JSON.parse($window.localStorage["givme_apikey"]);
      if (!keyDetails) {
        return;
      }

      var date = new Date();
      if (date.getTime() > keyDetails["date"]) {
        this.clearApiKey();
        return;
      }

      this.apiKey = keyDetails["key"];
      return;
    }

    this.confirmAndSetValidApi();

    this._login = function(facebookToken) {
      return $http.post('http://' + gmAPIServerIP + '/rest-auth/facebook/', {
        access_token: facebookToken
      })
        .then(function(result) {
          return result;
        })
        .catch(function(err) {
          return err;
        })
    };

    this.loginBrowserForTest = function() {
      this.apiKey = "5d669a195645e43c186398e6b69215c01951ba7f";
      this.apiKey = $window.localStorage['givme_apikey'];
      var date = new Date();
      $window.localStorage["givme_apikey"] = JSON.stringify({
              'key': this.apiKey,
              'date': date.getTime() + 60*60*1000
            });
      return;
    }

    this.loginViaFacebook =  function() {
      // TEMP
      /* Start Browser Test */
      if(!window.cordova){
        this.loginBrowserForTest();

        var deferred = $q.defer();
        setTimeout(function () {
          deferred.resolve(true)
        }, 500);
        return deferred.promise;
      }
      /* End Browser Test */

      var _this = this;
      return Facebook.login()
        .then(function(result) {
          return _this._login(result.access_token)
            .then(function(result) {
              if(result.data) {
                _this.apiKey = result.data.key || '';
                var date = new Date();
                $window.localStorage["givme_apikey"] = JSON.stringify({
                      'key': _this.apiKey,
                      'date': date.getTime() + 30*24*60*60*1000
                    });
                return true;
              }
              return false;
            })
            .catch(function(err) {
              return err;
            });
        })
        .catch(function(err) {
          return err;
        })
    };

    this.submitGender = function(gender) {
      var _this = this;
      var deferred = $q.defer();
      var data = {"gender": gender};
      $http.post('http://' + gmAPIServerIP + '/api-rest/profile/gender/', data, {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve({
            "success": true
          });
        })
        .catch(function(err) {
          deferred.resolve({
            "success": false
          });
        });
      return deferred.promise;
    }

    this.requestGame = function() {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/games/request/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve({
            game: result.data
          });
        })
        .catch(function(err) {
          deferred.resolve({
            game: {
              "players": [
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                },
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                }
              ]
            },
            socket: {}
          });
        });
      return deferred.promise;
    };

    this.rejectPlayer = function(playerId) {
      var _this = this;

      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api/users/' + playerId + '/reject/',
        headers: {
          'Authorization': 'Token ' + _this.apiKey
        }
      })
        .then(function(response) {
          return response;
        })
        .catch(function(err) {
          return err;
        });
    };

    this.acceptPlayer = function(playerId) {
      var _this = this;

      return $http({
        method: 'POST',
        url: 'http://' + gmAPIServerIP + '/api/users/' + playerId + '/accept/',
        headers: {
          'Authorization': 'Token ' + _this.apiKey
        }
      })
        .then(function(response) {
          return response;
        })
        .catch(function(err) {
          return err;
        });
    };

    this.requestRoom = function() {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/request/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {

          var socket = new WebSocket('ws://' + gmAPIServerIP + '/ws/room?token=' + _this.apiKey + '&subscribe-user&echo');

          deferred.resolve({
            room: result.data,
            socket: socket
          });
        })
        .catch(function(err) {
          deferred.resolve({
            game: {
              "players": [
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                },
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                }
              ]
            },
            socket: {}
          });
        });
      return deferred.promise;
    };

    this.requestPokedRoom = function(user_id) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/' + user_id + '/pokerequest/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          try {
            _this.currentPokeId = result.data.id;
          } catch(err) {
            console.log(err);
            _this.currentPokeId = 0;
          }
          var data = {
            "success": result.data.success
          }
          deferred.resolve(data);
        })
        .catch(function(err) {
          deferred.reject();
        });
      return deferred.promise;
    };

    this.acceptPokeRequest = function(room_id) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/' + room_id + '/pokeaccept/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          console.log(result);

          deferred.resolve({
            room: result.data
          });
        })
        .catch(function(err) {
          deferred.resolve({
            game: {
              "players": [
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                },
                {
                  "first_name": "Martha",
                  "last_name": "Williams",
                  "age": 28,
                  "languages": [],
                  "tags": []
                }
              ]
            },
            socket: {}
          });
        });
      return deferred.promise;
    };

    this.cancelPokeRequest = function(room_id) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/' + room_id + '/pokecancel/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.reject(false);
        });
      return deferred.promise;
    }

    this.rejectPokeRequest = function(room_id) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/' + room_id + '/pokereject/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.reject(false);
        });
      return deferred.promise;
    };


    // this.roomReportPlayer
    this.roomMakeWaiting = function() {
      var _this = this;
      $http.get('http://' + gmAPIServerIP + '/api/rooms/wait/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
    }
    this.roomMakeLive = function() {
      var _this = this;
      $http.get('http://' + gmAPIServerIP + '/api/rooms/unwait/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
    }
    this.roomMakeClosed = function() {
      var _this = this;
      $http.get('http://' + gmAPIServerIP + '/api/rooms/end/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
    }
    this.roomPokeLater = function() {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/pokelater/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.resolve(false);
        });
      return deferred.promise;
    }
    this.submitReport = function(data) {
      var _this = this;
      var deferred = $q.defer();
      $http.post('http://' + gmAPIServerIP + '/api/rooms/report/?format=json', data, {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.resolve(false);
        });
      return deferred.promise;
    }
    this.requestContactSocket = function() {
      var _this = this;
      var socket = new WebSocket('ws://' + gmAPIServerIP + '/ws/contacts?token=' + _this.apiKey + '&subscribe-user&echo');
      return socket;
    };

    this.pokeDelete = function(roomId) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/rooms/'+roomId+'/pokedelete/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.resolve(false);
        });
      return deferred.promise;
    }

    this.contactDelete = function(contactId) {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/contacts/delete/' + contactId + '?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.resolve(false);
        });
      return deferred.promise;
    }

    this.sendContactDetails = function(data) {
      var _this = this;
      var deferred = $q.defer();
      $http.post('http://' + gmAPIServerIP + '/api/rooms/contact/?format=json', data, {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {
          deferred.resolve(true);
        })
        .catch(function(err) {
          deferred.resolve(false);
        });
      return deferred.promise;
    }
    // this.roomPokeNow
}

angular.module('givmeApp.services')
  .service('GmAPI', GmAPI);

/**
 * Givme API server IP constant
 */
angular.module('givmeApp')
  .constant('gmAPIServerIP', '52.18.229.105');
  // .constant('gmAPIServerIP', '127.0.0.1:8000');

angular.module('givmeApp')
  .factory('SecuredPopups', [
    '$ionicPopup',
    '$q',
    function ($ionicPopup, $q) {

      var firstDeferred = $q.defer();
      firstDeferred.resolve();

      var lastPopupPromise = firstDeferred.promise;

      // Change this var to true if you want that popups will automaticly close before opening another
      var closeAndOpen = false;

      return {
        'show': function (method, object) {
          var deferred = $q.defer();
          var closeMethod = null;
          deferred.promise.isOpen = false;
          deferred.promise.close = function () {
            if (deferred.promise.isOpen && angular.isFunction(closeMethod)) {
              closeMethod();
            }
          };

          if (closeAndOpen && lastPopupPromise.isOpen) {
            lastPopupPromise.close();
          }

          lastPopupPromise.then(function () {
            deferred.promise.isOpen = true;
            var popupInstance = $ionicPopup[method](object);

            closeMethod = popupInstance.close;
            popupInstance.then(function (res) {
              deferred.promise.isOpen = false;
              deferred.resolve(res);
            });
          });

          lastPopupPromise = deferred.promise;

          return deferred.promise;
        }
      };
    }
  ])
