'use strict';

/**
 * Play page controller
 * @param $scope
 * @param $state
 * @param $timeout
 * @param $interval
 * @param $ionicLoading
 * @param GmAPI
 * @param PlayPersonPreview
 * @constructor
 */
function PlayCtrl($scope, $state, $timeout, $interval, $ionicLoading, GmAPI, PlayPersonPreview) {
  $scope.animate = true;
  $scope.persons = {topAccepted: "", topRejected: "", bottomAccepted: "", bottomRejected: ""};
  $scope.remain = 5;
  $scope.remainSeconds = "5 seconds";
  $scope.loaded = false;
  $scope.loading = "loading";
  var timeIsUpRestart = false;
  $scope.message = 'SEARCHING...';
  $scope.maxTime = 40;
  $scope.shouldPoint = true;

  $scope.barWidth = 270;
  $scope.firstCicle = 50;
  //  Calculates the width increase of each second.
  $scope.widthTick = ($scope.barWidth /  $scope.maxTime);

  GmAPI.requestGame()
    .then(function(result) {
      var game = result.game;
      var socket = result.socket;

      socket.onmessage = function(message) {

      };
      $scope.loading = "";

      var firstPlayer = game.players[0];
      var secondPlayer = game.players[1];

      $scope.topPerson = new PlayPersonPreview({
        name: firstPlayer.first_name + ' ' + firstPlayer.last_name,
        age: firstPlayer.age || 0,
        domId: "topPerson",
        photos: [
          {
            full: 'images/img-01.png',
            thumb: 'images/img-thumb-01.png',
            active: true
          },
          {
            full: 'images/img-07.png',
            thumb: 'images/img-thumb-07.png',
            active: false
          },
          {
            full: 'images/img-01.png',
            thumb: 'images/img-thumb-01.png',
            active: false
          },
          {
            full: 'images/img-07.png',
            thumb: 'images/img-thumb-07.png',
            active: false
          },
          {
            full: 'images/img-01.png',
            thumb: 'images/img-thumb-01.png',
            active: false
          }
        ],
        languages: firstPlayer.languages,
        iceBreakers: firstPlayer.tags
      });
      $scope.bottomPerson = new PlayPersonPreview({
        name: secondPlayer.first_name + ' ' + secondPlayer.last_name,
        age: secondPlayer.age || 0,
        domId: "bottomPerson",
        photos: [
          {
            full: 'images/img-01.png',
            thumb: 'images/img-thumb-06.png',
            active: true
          },
          {
            full: 'images/img-07.png',
            thumb: 'images/img-thumb-07.png',
            active: false
          },
          {
            full: 'images/img-01.png',
            thumb: 'images/img-thumb-08.png',
            active: false
          }
        ],
        languages: secondPlayer.languages,
        iceBreakers: secondPlayer.tags
      });

      $scope.topPerson.onAccept =
        $scope.bottomPerson.onAccept = function() {

          if ($scope.topPerson.accepted) {
            GmAPI.acceptPlayer(firstPlayer.id);
          }
          if ($scope.bottomPerson.accepted) {
            GmAPI.acceptPlayer(secondPlayer.id);
          }

          if ($scope.topPerson.accepted || $scope.bottomPerson.accepted) {
            $timeout(function() {
              if(timeIsUpRestart)
                $timeout.stop(timeIsUpRestart);
              $interval.cancel(gameTime);
              $state.go('match',{},{location:'replace'});
            }, 1000);
          }
        };

      $scope.topPerson.onReject =
        $scope.bottomPerson.onReject = function() {

          if ($scope.topPerson.rejected) {
            GmAPI.rejectPlayer(firstPlayer.id);
          }
          if ($scope.bottomPerson.rejected) {
            GmAPI.rejectPlayer(secondPlayer.id);
          }

          if ($scope.topPerson.rejected && $scope.bottomPerson.rejected) {
            $('#reject').modal('show');
            if(timeIsUpRestart)
              $timeout.stop(timeIsUpRestart);
            $interval.cancel(gameTime);
            $interval(function () {
              $scope.remain--;
              if($scope.remain > 1)
                $scope.remainSeconds = $scope.remain + " seconds";
              else
                $scope.remainSeconds = $scope.remain + " second";
            }, 1000);
            $timeout(function() {
              $('#reject').modal('hide');
              $state.reload();
            }, 5000);
          }
        };

      $timeout(function() {
        var $flipBlock = $(".slide-flip-block");
        $scope.loaded = true;
        $scope.transition = 'none';
        //$scope.percentage = 0;
        $scope.currentTime = 0;
        $scope.message = 'TIME IS RUNNING OUT';
        $flipBlock.css('height',$flipBlock.find("img").height()+3);
        $flipBlock.flip({"axis":"x","speed":200});
      }, 1000);

      //$scope.percentage = 0;
      $scope.currentTime = 0;
      $scope.message = 'SEARCHING...';
      var gameTime = $interval(function () {
        if($scope.loaded && $scope.currentTime >= $scope.maxTime) {
          $('#time-is-up').modal('show');
          $interval.cancel(gameTime);
          $interval(function () {
            $scope.remain--;
            if($scope.remain > 1)
              $scope.remainSeconds = $scope.remain + " seconds";
            else
              $scope.remainSeconds = $scope.remain + " second";
          }, 1000);
          timeIsUpRestart = $timeout(function() {
            $('#time-is-up').modal('hide');
            $state.reload();
          }, 5000);
        }
        else if($scope.loaded) {
        // + 1 is used here else the first tick of 0 doesn't increase the bar, thus throwing progress bar off.
          var ct = $scope.currentTime + 1;
          $scope.transition = 'all linear 1s';
          $scope.percentage = ($scope.widthTick * ct) + $scope.firstCicle;
          $scope.currentTime++;
          $scope.shouldPoint = $scope.percentage < 270;
        }
      }, 1000);

      $scope.timeoutProgress = function() {
        return {
          width: $scope.percentage + 'px',
          transition: $scope.transition
        }
      };

      $scope.timeoutSeconds = function() {
        return $scope.maxTime - $scope.currentTime;
      };

      $scope.$watchCollection('persons', function(person){
        if(person.topAccepted == true) {
          $scope.topPerson.accept();
        }
        else {
          if (person.topRejected == true) {
            $scope.topPerson.reject();
          }
          if (person.bottomAccepted == true) {
            $scope.bottomPerson.accept();
          }
          else {
            if (person.bottomRejected == true) {
              $scope.bottomPerson.reject();
            }
          }
        }
      });

    })
    .catch(function(err) {
      console.log(JSON.stringify(err));
    });
}

angular.module('givmeApp.controllers')
  .controller('PlayCtrl',['$scope', '$state', '$timeout', '$interval', '$ionicLoading', 'GmAPI', 'PlayPersonPreview', PlayCtrl]);