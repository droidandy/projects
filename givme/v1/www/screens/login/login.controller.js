'use strict';

/**
 * Main page controller
 * @param $scope
 * @param $state
 * @param Facebook
 * @param GmAPI
 * @constructor
 */
function LoginCtrl($scope, $state, Facebook, Profile, GmAPI) {
  // $state.go('menu');
  $scope.facebookLogin = function() {
    $state.go('menu');
        // GmAPI.loginViaFacebook()
        //   .then(function(result) {
        //     if(result === true) {
        //       Profile.load();
        //       $state.go('menu');
        //     }
        //   })
        //   .catch(function(err) {
        //     console.error(err);
        //   });
  }
}

angular.module('givmeApp.controllers')
  .controller('LoginCtrl',LoginCtrl);