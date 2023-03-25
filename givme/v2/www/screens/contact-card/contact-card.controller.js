'use strict';

/**
 * Contact card page controller
 * @param $scope
 * @param $state
 * @constructor
 */
function ContactCardCtrl($scope, $state) {
  $scope.nextSettingsPage = function(event) {
    $state.go('settings-profile-card');
  };

  $scope.prevSettingsPage = function(event) {
    $state.go('settings-discovery-card');
  };
}

angular.module('givmeApp.controllers')
  .controller('ContactCardCtrl',['$scope', '$state', ContactCardCtrl]);