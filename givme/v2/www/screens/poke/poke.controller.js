'use strict';

/**
 * Match page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function PokeCtrl($scope, $rootScope, $state, $interval, $timeout, $window, GmAPI, gmAPIServerIP) {

      $scope.roomState = "pending";
      $scope.secondsRemain = 300;
      $scope.poked = false;
      $scope.contact = $rootScope.poking;

      var interval = $interval(function() {
        $scope.secondsRemain--;
        if($scope.secondsRemain == 0) {
          $interval.cancel(interval);
        }
      }, 1000);

      $scope.pokingStatement = function() {
        if ($scope.poked) {
          return $scope.contact.first_name + " can't talk at the moment"
        }
        return "Poking " + $scope.contact.first_name + "..."
      }

      $scope.getImage = function() {
        if ($scope.contact.photos[0].image) {
          return "http://" + gmAPIServerIP + $scope.contact.photos[0].image;
        }
        return "";
      }

      $scope.$on('room.live', function(event, args) {
        $state.go('video');
        $interval.cancel(interval);
      });

      $scope.$on('room.pokecancelled', function(event, args) {
        $state.go('menu');
        $interval.cancel(interval);
      });

      $scope.$on('room.endpoke', function(event, args) {
        $interval.cancel(interval);
        $scope.poked = true;
        $timeout(function() { 
          $state.go('menu');
        }, 2500);
      });

      $scope.pokeLater = function() {
        $interval.cancel(interval);
        GmAPI.cancelPokeRequest($rootScope.roomId)
          .then(function(result) {
            $state.go('menu');
          });
      }
}

angular.module('givmeApp.controllers')
  .controller('PokeCtrl',['$scope', '$rootScope', '$state', '$interval', '$timeout', '$window', 'GmAPI', 'gmAPIServerIP', PokeCtrl]);