'use strict';

/**
 * Match page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function MatchCtrl($scope, $state, $interval, $window, GmAPI) {

  GmAPI.requestRoom()
    .then(function(result) {
      var room = result.room;
      var socket = result.socket;
      $scope.roomState = "pending";
      $scope.secondsRemain = 500;
      $scope.poked = false;

      $scope.interval = $interval(function() {
        $scope.secondsRemain--;
        if($scope.secondsRemain == 0) {
          $interval.cancel($scope.interval);
          $state.go('video');
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

      $scope.pokeLater = function() {
        $interval.cancel($scope.interval);
        GmAPI.roomPokeLater()
          .then(function(result) {
            $state.go('menu');
          });
      }

      $scope.okay = function() {
        $state.go('menu');
      }

      socket.onmessage = function(message) {
        if (message.data == "----HEARTBEAT----") {
          return;
        }
        var data = JSON.parse(message.data);
        if (data.state == "live" && $scope.roomState != "live") {
          $state.go('video');
        }
        if (data.state == "poke" && $scope.roomState != "poke") {
          $scope.poked = true;
          $interval.cancel($scope.interval);
          setTimeout(function() {
            $scope.$apply();
          }, 50)
        }
      };

    })
    .catch(function(err) {
    });


  // $scope.person = {
  //   name: 'Chiara',
  //   age: 28,
  //   animateChange: false,
  //   photos: [
  //     {
  //       full: 'images/img-01.png',
  //       thumb: 'images/img-thumb-01.png',
  //       active: true
  //     },
  //     {
  //       full: 'images/img-07.png',
  //       thumb: 'images/img-thumb-02.png',
  //       active: false
  //     },
  //     {
  //       full: 'images/img-01.png',
  //       thumb: 'images/img-thumb-03.png',
  //       active: false
  //     },
  //     {
  //       full: 'images/img-07.png',
  //       thumb: 'images/img-thumb-04.png',
  //       active: false
  //     },
  //     {
  //       full: 'images/img-01.png',
  //       thumb: 'images/img-thumb-05.png',
  //       active: false
  //     }
  //   ]
  // };
  // *
  //  * Set photo to active state and show it in full size.
  //  * @param photo
   
  // $scope.selectPhoto = function(photo) {
  //   if(photo.full !== $scope.selectedPhoto()) {
  //     $scope.person.animateChange = true;
  //   }
  //   //  Reset all photos to inactive state
  //   this.person.photos.forEach(function(photo) {
  //     photo.active = false;
  //   });
  //   //  Set selected photo to active state
  //   photo.active = true;
  // };

  // /**
  //  * Returns url of big selected photo
  //  * @returns {string}
  //  */
  // $scope.selectedPhoto = function() {
  //   return $scope.person.photos.filter(function(photo) {
  //     return photo.active;
  //   })[0].full;
  // };
  // /**
  //  * Returns name of selected person
  //  * @returns {string}
  //  */
  // $scope.selectedName = function() {
  //   return $scope.person.name + ", " + $scope.person.age;
  // };
}

angular.module('givmeApp.controllers')
  .controller('MatchCtrl',['$scope', '$state', '$interval', '$window', 'GmAPI', MatchCtrl]);