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
function ChangePasscodeCtrl($scope, $rootScope, $stateParams, $window, Profile, $state, $ionicPopup) {
  $scope.data = {};

  $scope.confirmPasscode = function() {
    if( $scope.data.currentPasscode ) {
      if( $scope.data.newPasscode ) {
        if( $scope.data.confirmPasscode ) {
          if( $scope.data.newPasscode == $scope.data.confirmPasscode ) {
            try {
              var decryptedPassword = CryptoJS.AES.decrypt($window.localStorage["givme_passcode"], $scope.data.currentPasscode).toString(CryptoJS.enc.Utf8);
              if (decryptedPassword) {
                var encrypted = CryptoJS.AES.encrypt($scope.data.newPasscode, $scope.data.newPasscode);
                $window.localStorage["givme_passcode"] = encrypted.toString();
                $state.go("settings-security")
              } else {
                var alertPopup = $ionicPopup.alert({
                  template: 'Please enter your current passcode correctly'
                });
              }
            } catch(err) {
              var alertPopup = $ionicPopup.alert({
                template: 'Please enter your current passcode correctly'
              });
            }
          } else {
            var alertPopup = $ionicPopup.alert({
              template: 'Please confirm the new passcode'
            });
          }
        }
      } 
    }     
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
}

angular.module('givmeApp.controllers')
  .controller('ChangePasscodeCtrl', ChangePasscodeCtrl);

