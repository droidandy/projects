'use strict';

/**
 * Match page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function PokedCtrl($scope, $state, $interval, $window, GmAPI) {

      $scope.roomState = "pending";
      $scope.secondsRemain = 300;
      $scope.poked = false;

      var interval = $interval(function() {
        $scope.secondsRemain--;
        if($scope.secondsRemain == 0) {
          $interval.cancel(interval);
          $state.go('video');
        }
      }, 1000);

      $scope.pokeLater = function() {
        $interval.cancel(interval);
        GmAPI.rejectPokeRequest()
          .then(function(result) {
            $state.go('menu');
          });
      }
}

angular.module('givmeApp.controllers')
  .controller('PokedCtrl',['$scope', '$state', '$interval', '$window', 'GmAPI', PokedCtrl]);