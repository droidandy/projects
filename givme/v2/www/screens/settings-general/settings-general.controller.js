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
function SettingsGeneralCtrl($scope, $timeout, $ionicSlideBoxDelegate, $window, $state, Profile, Camera) {
  $scope.storeGeneralData = function(obj) {
    $window.localStorage["givme_general"] = JSON.stringify(obj);
  }

  if(!$window.localStorage["givme_general"]) {
    var generalData = {
      "notifications": true,
      "mobile_data": true,
      "vibration": true,
      "add_to_contacts": true
    }
    $scope.storeGeneralData(generalData);
  }
  $scope.generalData = JSON.parse($window.localStorage["givme_general"]);
  $scope.$watchCollection('generalData', function() {
    $scope.storeGeneralData($scope.generalData);
  });
  $scope.logout = function() {
    Profile.empty();
    $state.go("login");
  }
}

angular.module('givmeApp.controllers')
  .controller('SettingsGeneralCtrl', SettingsGeneralCtrl);