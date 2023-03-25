'use strict';

/**
 * Match page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function MatchCtrl($scope, $state, $interval, $window, GmAPI) {
      /*
       * Match states
       */
      // Pending (only countdown)
      $scope.$on('room.pending', function(event, args) {
        $scope.setupMatchRoom(args.updated);
      });

      // the other person will poke later
      $scope.$on('room.pokelater', function(event, args) {
        $interval.cancel($scope.interval);
        $scope.setupPokeLater();
      });

      // the room will go live
      $scope.$on('room.live', function(event, args) {
        $state.go('video');
        $interval.cancel($scope.interval);
      });

      // otherwise, redirect to the menu
      $scope.$on('room.other', function(event, args) {
        $interval.cancel($scope.interval);
        $state.go('menu');
      });




      /*
       * Set up match room
       */

      $scope.setupMatchRoom = function(time) {
        $scope.roomState = "pending";
        $scope.maxSecondsRemain = 10;
        $scope.poked = false;

        var d1 = new Date();
        var currentTime = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
        $scope.secondsRemain = $scope.maxSecondsRemain - (Math.floor(currentTime.getTime()/ 1000) - time);

        $scope.interval = $interval(function() {
          $scope.secondsRemain--;
          if($scope.secondsRemain == 0) {
            $state.go('video');
            $interval.cancel($scope.interval);
          }
        }, 1000);

        if (navigator && navigator.vibrate) { 
          if ($window.localStorage["givme_general"]) {
            $scope.generalData = JSON.parse($window.localStorage["givme_general"]);
            if ($scope.generalData["vibration"]) {
              navigator.vibrate(1000);
            }
          }
        }
      }

      $scope.setupPokeLater = function() {
        $scope.poked = true;
        $interval.cancel(interval);
        setTimeout(function() {
          $scope.$apply();
        }, 50);
      }




      /*
       * Supportive functions
       */

      $scope.okay = function() {
        $state.go('menu');
      }

      // handle poke later functionality
      $scope.pokeLater = function() {
        $interval.cancel(interval);
        GmAPI.roomPokeLater()
          .then(function(result) {
            $state.go('menu');
          });
      }
}

angular.module('givmeApp.controllers')
  .controller('MatchCtrl',['$scope', '$state', '$interval', '$window', 'GmAPI', MatchCtrl]);