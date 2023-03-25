'use strict';

/**
 * Discovery card page controller
 * @param $scope
 * @param $state
 * @constructor
 */
function DiscoveryCardCtrl($scope, $state) {
  $scope.range = 13;
  $scope.gender = {
    man: false,
    women: true
  };

  $scope.nextSettingsPage = function(event) {
    $state.go('settings-contact-card');
  };

  $scope.prevSettingsPage = function(event) {
    $state.go('settings');
  };
}

angular.module('givmeApp.controllers')
  .controller('DiscoveryCardCtrl',['$scope', '$state', DiscoveryCardCtrl]);