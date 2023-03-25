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
function SettingsCtrl($scope, $timeout, $ionicSlideBoxDelegate, Profile, Camera) {

  $scope.shareNative = function() {
    if (window.plugins && window.plugins.socialsharing) {
        window.plugins.socialsharing.share("I'll be attending the session: here.",
            'PhoneGap Day 2014', null, "http://pgday.phonegap.com/us2014",
            function() {
                console.log("Success")
            },
            function (error) {
                console.log("Share fail " + error)
            });
    }
    else {
    }
  }

  Profile.getOrRedirect()
    .then(function(profile) {

    })
    .catch(function(err) {
      console.error(err);
    });

  
}

angular.module('givmeApp.controllers')
  .controller('SettingsCtrl', SettingsCtrl);