'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 * @param $rootScope
 * @param $state
 * @param $ionicSlideBoxDelegate
 */
function HelpCtrl($scope, $rootScope, $state, $ionicSlideBoxDelegate) {
  $rootScope.help_background = {background: 'none'};
  $scope.swipe = "Swipe to continue";
  $scope.index = 0;
  $scope.activateTabs = function(index) {
    $scope.index = index;
    if(index == 4) {
      $scope.swipe = "<span class='btn btn-primary'>Done<span>";
    }
    else {
      $scope.swipe = "Swipe to continue";
    }
  };

  $scope.done = function() {
    if($scope.index == 4){
      // $state.go('login');
      $state.go('menu');
    }
  };

  $scope.slide = function(to) {
    $scope.current = to;
    $ionicSlideBoxDelegate.slide(to);
  };

  $scope.login = function() {
    // $state.go('login');
    $state.go('menu');
  };
}

angular.module('givmeApp.controllers')
  .controller('HelpCtrl',['$scope', '$rootScope','$state', '$ionicSlideBoxDelegate', HelpCtrl]);