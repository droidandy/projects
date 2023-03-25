'use strict';

/**
 * Match page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function PokedCtrl($scope, $rootScope, $state, $interval, $window, GmAPI, gmAPIServerIP) {

      $scope.roomState = "pending";
      $scope.secondsRemain = 15;
      $scope.poked = false;
      $scope.contact = $rootScope.pokeContact

      var interval = $interval(function() {
        $scope.secondsRemain--;
        if($scope.secondsRemain == 0) {
          $interval.cancel(interval);
          GmAPI.acceptPokeRequest($rootScope.roomId);
        }
      }, 1000);

      $scope.pokingStatement = function() {
        return $scope.contact.first_name + " is poking you"
      }

      $scope.getImage = function() {
        if ($scope.contact.photos[0].image) {
          return "http://" + gmAPIServerIP + $scope.contact.photos[0].image;
        }
        return "";
      }

      $scope.$on('room.live', function(event, args) {
        $interval.cancel(interval);
        $state.go('video');
      });

      $scope.$on('room.pokecancelled', function(event, args) {
        $interval.cancel(interval);
        $state.go('menu');
      });

      $scope.cancel = function() {
        $interval.cancel(interval);
        GmAPI.rejectPokeRequest($rootScope.roomId)
          .then(function(result) {
            $state.go('menu');
          });
      }
}

angular.module('givmeApp.controllers')
  .controller('PokedCtrl',['$scope', '$rootScope', '$state', '$interval', '$window', 'GmAPI', 'gmAPIServerIP', PokedCtrl]);