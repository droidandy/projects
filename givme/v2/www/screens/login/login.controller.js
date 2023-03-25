'use strict';

/**
 * Main page controller
 * @param $scope
 * @param $state
 * @param Facebook
 * @param GmAPI
 * @constructor
 */
function LoginCtrl($scope, $state, $window, $timeout, Facebook, Profile, GmAPI) {
  
  $scope.loading = false;
  $scope.defaultLoginText = "Log in with Facebook";
  $scope.loginText = $scope.defaultLoginText
  
  $scope.facebookLogin = function() {
    // $state.go('menu');
    if (!$scope.loading) {
      $scope.loading = true;
      $scope.loginText = "Logging in";
        GmAPI.loginViaFacebook()
          .then(function(result) {
            if(result === true) {
              Profile.load()
                .then(function(profile) {

                  if(!$window.localStorage["firstStart"]) {
                    $window.localStorage["firstStart"] = "true";
                    if (!profile.gender) {
                      $state.go('gender');
                    } else {
                      $state.go('tutorial1');
                    }
                  } else {
                    $state.go('menu');
                  }
                  $scope.loading = false;
                  $scope.loginText = $scope.defaultLoginText;
                })
            }
          })
          .catch(function(err) {
            console.error(err);
            $scope.loading = false;
            $scope.loginText = $scope.defaultLoginText;
          });
    }
  }
  $scope.isLoading = function() {
    if ($scope.loading) {
      return "faded";
    }
    return "";
  }
}

angular.module('givmeApp.controllers')
  .controller('LoginCtrl',LoginCtrl);