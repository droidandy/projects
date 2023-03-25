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
function SettingsSecurityCtrl($scope, $rootScope, $timeout, $ionicSlideBoxDelegate, $window, Profile, Camera, $state) {
  $scope.storeSecurityData = function(obj) {
    $window.localStorage["givme_security"] = JSON.stringify(obj);
  }

  if(!$window.localStorage["givme_security"]) {
    var securityData = {
      "passcode": false,
      "touchId": false
    }
    $scope.storeSecurityData(securityData);
  }
  $scope.securityData = JSON.parse($window.localStorage["givme_security"]);

  $scope.$watchCollection('securityData', function() {
    $scope.storeSecurityData($scope.securityData);
  });

  $scope.changePasscode = function() {
    if( $window.localStorage["givme_passcode"] ) 
      $state.go("change-passcode");
    else
      $state.go("add-passcode");
  }
}

angular.module('givmeApp.controllers')
  .controller('SettingsSecurityCtrl', SettingsSecurityCtrl);