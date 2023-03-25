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
function GmAPI($q, $http, $cordovaOauth, Facebook, gmAPIServerIP, FacebookAppID) {

    this.apiKey = '';
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

    this.loginViaFacebook =  function() {

      //TEMP LOGIN
      // this.apiKey = '0ed430366a986a04701aa21fc2451850523be0e8';
      // var deferred = $q.defer();
      // deferred.resolve(true);
      // return deferred.promise;
      //TEMP LOGIN

      var _this = this;
      return Facebook.login()
        .then(function(result) {
          return _this._login(result.access_token)
            .then(function(result) {
              if(result.data) {
                _this.apiKey = result.data.key || '';
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

    this.requestGame = function() {
      var _this = this;
      var deferred = $q.defer();
      $http.get('http://' + gmAPIServerIP + '/api/games/request/?format=json', {
        headers: {'Authorization': 'Token ' + _this.apiKey}
      })
        .then(function(result) {

          var socket = new WebSocket('ws://52.18.229.105/ws/game?token=' + _this.apiKey + '&subscribe-user&echo');

          deferred.resolve({
            game: result.data,
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
}

angular.module('givmeApp.services')
  .service('GmAPI', GmAPI);

/**
 * Givme API server IP constant
 */
angular.module('givmeApp')
  .constant('gmAPIServerIP', '52.18.229.105');