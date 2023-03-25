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
function AddPasscodeCtrl($scope, $rootScope, $window, $state, $ionicPopup, $ionicHistory) {
  $scope.data = {};
  $scope.addPasscode = function() {
    if( $scope.data.newPasscode ) {
      if( $scope.data.confirmPasscode ) {
        if( $scope.data.newPasscode == $scope.data.confirmPasscode ) {
          var encrypted = CryptoJS.AES.encrypt($scope.data.newPasscode, $scope.data.newPasscode);
          $window.localStorage["givme_passcode"] = encrypted.toString();
          $state.go("settings-security");
        } else {
          var alertPopup = $ionicPopup.alert({
            template: 'Your passcodes don\'t match'
          });
        }
      } else {
        var alertPopup = $ionicPopup.alert({
          template: 'You must confirm your passcode'
        });
      }
    }
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
}

angular.module('givmeApp.controllers')
  .controller('AddPasscodeCtrl', AddPasscodeCtrl);

