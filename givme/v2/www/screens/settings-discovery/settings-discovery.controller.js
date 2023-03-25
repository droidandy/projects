'use strict';

/**
 * Settings page controller
 * @param $scope
 * @param $timeout
 * @param $ionicSlideBoxDelegate
 * @param Profile
 * @param Camera
 * @constructor
 */
function SettingsDiscoveryCtrl($scope, $timeout, $ionicSlideBoxDelegate, $stateParams, $window, Profile, Camera) {

  Profile.getOrRedirect()
    .then(function(profile) {
      $scope.discoveryData = profile.preferences;
      var timeout = undefined;
      $scope.$watchCollection('discoveryData', function() {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(function() {
            Profile.saveDiscovery($scope.discoveryData);
        }, 100);
      });
  });
}

angular.module('givmeApp.controllers')
  .controller('SettingsDiscoveryCtrl', SettingsDiscoveryCtrl);