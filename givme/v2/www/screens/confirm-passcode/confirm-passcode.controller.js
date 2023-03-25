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
function ConfirmPasscodeCtrl($scope, $rootScope, $stateParams, $window, Profile, $state, $ionicPopup) {

  if( !$window.localStorage["passcode"] ) {
    $state.go("menu");
    return;
  }
  $scope.data = {};
  $scope.confirmPasscode = function() {
    try {
      var decryptedPassword = CryptoJS.AES.decrypt($window.localStorage["givme_passcode"], $scope.data.passcode).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword) {
        $state.go("menu");
      } else {
        var alertPopup = $ionicPopup.alert({
          template: 'Please enter your current passcode'
        });
      }
    } catch(err) {
      var alertPopup = $ionicPopup.alert({
        template: 'Please enter your current passcode'
      });
    }
  }
}

angular.module('givmeApp.controllers')
  .controller('ConfirmPasscodeCtrl', ConfirmPasscodeCtrl);

