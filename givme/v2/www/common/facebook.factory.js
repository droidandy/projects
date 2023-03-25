'use strict';

function Facebook($q, $cordovaOauth, FacebookAppID) {
  return {
    login: function() {
      var self = this;
      var deferred = $q.defer();
      $cordovaOauth.facebook(FacebookAppID, ["email","user_birthday","user_photos"]).then(function(result) {
        self._access_token = result.access_token;
        self._expires_in = result.expires_in;
        deferred.resolve({
          access_token: result.access_token,
          expires_in: result.expires_in
        });
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }
}

angular.module('givmeApp.services')
.factory('Facebook', ['$q', '$cordovaOauth', 'FacebookAppID', Facebook]);