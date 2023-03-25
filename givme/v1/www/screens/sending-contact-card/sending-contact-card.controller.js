'use strict';

/**
 * Contact card page controller
 * @param $scope
 * @constructor
 */
function SendingContactCardCtrl($scope) {
  $scope.activeNetworks = {};
  $scope.active = false;
  $scope.activate = function(network) {
    $scope.activeNetworks[network.target.text] = !$scope.activeNetworks[network.target.text];
    var hashKeys = Object.keys($scope.activeNetworks);
    for( var i=0, l=hashKeys.length; i<l; ++i ) {
      if($scope.activeNetworks[ hashKeys[i] ]) {
        $scope.active = true;
        return;
      }
      else
        $scope.active = false;
    }
  }
}

angular.module('givmeApp.controllers')
  .controller('SendingContactCardCtrl',['$scope', SendingContactCardCtrl]);