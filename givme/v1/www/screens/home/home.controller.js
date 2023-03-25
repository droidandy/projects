'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 * @param $window
 * @param $state
 * @param $timeout
 */
function HomeCtrl($scope, $window, $state, $timeout) {
  $timeout(function() {
    $scope.loading = "loading"
  }, 10);
  //$window.localStorage.clear();
  if(!$window.localStorage["firstStart"]) {
    $window.localStorage["firstStart"] = "true";
    $timeout(function(){
      $state.go('help');
    }, 3000);
  }
  else {
    $timeout(function(){
      // $state.go('login');
      $state.go('help');
    }, 3000);
  }
  $scope.loading = "";
}

angular.module('givmeApp.controllers')
  .controller('HomeCtrl',['$scope', '$window', '$state', '$timeout', HomeCtrl]);