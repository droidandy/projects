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
function SettingsContactCtrl($scope, $timeout, $ionicSlideBoxDelegate, $stateParams, $window, Profile, Camera) {

  Profile.getOrRedirect()
    .then(function(profile) {
      $scope.contactData = profile.contacts;
      var timeout = undefined;
      $scope.$watchCollection('contactData', function() {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(function() {
          Profile.saveContact($scope.contactData);
        }, 100);
      });

      $scope.type = undefined;
      $scope.typeTitle = undefined;
      $scope.typePlaceholder = undefined;
      if ($stateParams && $stateParams.slug) {
        $scope.type = $stateParams.slug;
        switch ($scope.type) {
          case "phone_number":
            $scope.typeTitle = "Phone";
            $scope.typePlaceholder = "Your phone number";
            break;
          case "facebook":
            $scope.typeTitle = "Facebook username";
            $scope.typePlaceholder = "Your Facebook username";
            break;
          case "skype":
            $scope.typeTitle = "Skype";
            $scope.typePlaceholder = "Your Skype address";
            break;
          case "instagram":
            $scope.typeTitle = "Instagram";
            $scope.typePlaceholder = "Your Instagram username";
            break;
          case "snapchat":
            $scope.typeTitle = "Snapchat";
            $scope.typePlaceholder = "Your Snapchat username";
            break;
        }
      }
  });

}

angular.module('givmeApp.controllers')
  .controller('SettingsContactCtrl', SettingsContactCtrl);