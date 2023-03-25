'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 * @param $window
 * @param $state
 * @param $timeout
 */
function HomeCtrl($scope, $window, $state, $timeout, Profile) {
  $timeout(function() {
    $scope.loading = "loading"
  }, 10);
  // $window.localStorage.clear();
  $timeout(function(){
    Profile.getOrRedirect()
      .then(function() {
        if(!$window.localStorage["firstStart"]) {
          $window.localStorage["firstStart"] = "true";
          $state.go('tutorial1');
        } else {
          $state.go('menu');
        }
      });
  }, 2000);
  $scope.loading = "";
}

angular.module('givmeApp.controllers')
  .controller('HomeCtrl',['$scope', '$window', '$state', '$timeout', 'Profile', HomeCtrl]);