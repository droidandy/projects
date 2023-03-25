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
function PlayCtrl($scope, $state, $timeout, $interval, $ionicLoading, GmAPI, PlayPersonPreview, $rootScope, $window) {
  /*
   * Initial variables
   */
  
  $scope.persons = {topAccepted: "", topRejected: "", bottomAccepted: "", bottomRejected: ""};

  var timeIsUpRestart = false;
  $scope.loading = "loading";
  $scope.gameState = "pending";
  $scope.message = 'SEARCHING...';
  $scope.gameActive = false;
  
  $scope.animate = true;
  $scope.completed = false;
  $scope.loaded = false;
  $scope.shouldPoint = true; // used for angle of the progress bar

  $scope.maxTime = 40;
  $scope.remain = 5; // 5 seconds at the end
  $scope.remainSeconds = "5 seconds";

  //  Calculates the width increase of each second.
  $scope.barWidth = 270;
  $scope.firstCicle = 50;
  $scope.widthTick = ($scope.barWidth /  $scope.maxTime);




  /*
   * Game states
   */

  // if pending, request game (refreshing this doesn't hurt)!
  $scope.$on('game.pending', function(event, args) {
    $state.go("menu");
  });

  // if live, display game
  // $scope.$on('game.live', function(event, args) {
  //   $scope.liveSetupPlayers(args.players);
  //   $scope.liveSetupGame(args.updated);
  // });

  // if ended, end game
  $scope.$on('game.ended', function(event, args) {
    $scope.endGame(args.match);
  });



  /*
     * Supportive functions - could be placed elsewhere?
     */

    // bind handlers when screen is properly displayed
    $scope.bindHandlers = function() {
      $timeout(function() {
        $scope.loaded = true;
        $scope.transition = 'none';
        $scope.message = 'TIME IS RUNNING OUT';

        var $flipBlock = $(".slide-flip-block");
        $flipBlock.css('height',$flipBlock.find("img").height()+3);
        $flipBlock.flip({"axis":"x","speed":200});
      }, 1000);
    }

    // display "time is up" modal and restart the game
    $scope.displayGameEnded = function() {
      if (["waiting","replay"].indexOf($scope.gameState) >= 0) {
        $scope.gameState = "ended";
        $scope.endGame(match);
      } else {
        $scope.gameState = "timeup";
        $interval.cancel($scope.gameTime);
        $interval.cancel($scope.remainTime);
        $scope.remainTime = $interval(function () {
          $scope.remain--;
          if($scope.remain > 1)
            $scope.remainSeconds = $scope.remain + " seconds";
          else
            $scope.remainSeconds = $scope.remain + " second";
        }, 1000);
        $timeout(function() {
            $interval.cancel($scope.gameTime);
            $interval.cancel($scope.remainTime);
            // $state.reload();
          }, 5000);
      }
    }
    // check if the game has "ended", separate to the primary functions
    $scope.gameIsEnded = function() { // 5 seconds at the end
      return $scope.loaded && $scope.currentTime >= $scope.maxTime + 1;
    }

    // return person preview based on the person object
    $scope.getPersonPreview = function(person, personId) {
      return new PlayPersonPreview({
        name: person.first_name,
        age: person.age || 0,
        domId: personId + "Person",
        photos: person.photos,
        languages: person.languages,
        iceBreakers: person.tags,
        tagsString: person.tagsString,
        languagesString: person.languagesString
      });
    }

    // setup the game interval
    $scope.setupGameInterval = function() {
      return $interval(function () {
          // only called if the user runs out of time without the socket responding
          if($scope.gameIsEnded()) {
            // $scope.displayGameEnded();
          } else if($scope.loaded) {
            $scope.updateProgressBar();
          }
      }, 1000);
    }
    $scope.timeoutProgress = function() {
      return {
        width: $scope.percentage + 'px',
        transition: $scope.transition
      }
    };

    $scope.timeoutSeconds = function() {
      if (!$scope.currentTime) {
        return "";
      }
      return ($scope.maxTime - $scope.currentTime >= 0) ? $scope.maxTime - $scope.currentTime : 0;
    };
    $scope.secondsColour = function() {
      if ($scope.maxTime - $scope.currentTime < 4) {
        return "white";
      }
    }

    $scope.updateProgressBar = function() {
      // + 1 is used here else the first tick of 0 doesn't increase the bar, thus throwing progress bar off.
      var ct = $scope.currentTime + 1;
      if (ct > $scope.maxTime) {
        ct = $scope.maxTime;
      }
      $scope.transition = 'all linear 0.35s';
      $scope.currentTime = $scope.getCurrentTimeInterval();
      $scope.percentage = ($scope.widthTick * ct) + $scope.firstCicle;
      $scope.shouldPoint = $scope.maxTime - $scope.currentTime < 7;
    }

    $scope.goTo = function(location) {
      $interval.cancel($scope.gameTime);
      $interval.cancel($scope.remainTime);
      $state.go(location);
    }




  /*
   * logic - making game live!
   */

  // function for managing player variables
  $scope.liveSetupPlayers = function(players) {
    $scope.gameActive = true;

      var photoList = [];
      $.each(players[0].photos, function(index, value) {
        value.full = value.card;
        value.thumb = value.thumbnail;
        value.active = false;
        if (index < 1) {
          value.active = true;
        }
        photoList.push(value);
      })
      var tagsString = players[0].tags.slice(0,-1).join(", ")
      if (players[0].tags.length > 1) {
        tagsString += " and " + players[0].tags[players[0].tags.length-1];
      }
      var languagesString = players[0].languages.slice(0,-1).join(", ")
      if (players[0].languages.length > 1) {
        languagesString += " and " + players[0].languages[players[0].languages.length-1];
      }

      $scope.topPerson = new PlayPersonPreview({
        name: players[0].first_name,
        gender: players[0].gender,
        age: players[0].age || 0,
        domId: "topPerson",
        photos: photoList,
        languages: players[0].languages,
        iceBreakers: players[0].tags,
        tagsString: tagsString,
        languagesString: languagesString,
      },"top");

      tagsString = players[1].tags.slice(0,-1).join(", ")
      if (players[1].tags.length > 1) {
        tagsString += " and " + players[1].tags[players[1].tags.length-1];
      }
      languagesString = players[1].languages.slice(0,-1).join(", ")
      if (players[1].languages.length > 1) {
        languagesString += " and " + players[1].languages[players[1].languages.length-1];
      }

      photoList = [];
      $.each(players[1].photos, function(index, value) {
        value.full = value.card;
        value.thumb = value.thumbnail;
        value.active = false;
        if (index < 1) {
          value.active = true;
        }
        photoList.push(value);
      })

      $scope.bottomPerson = new PlayPersonPreview({
        name: players[1].first_name,
        gender: players[1].gender,
        age: players[1].age || 0,
        domId: "bottomPerson",
        photos: photoList,
        languages: players[1].languages,
        iceBreakers: players[1].tags,
        tagsString: tagsString,
        languagesString: languagesString,
      },"bottom");

      var firstPlayer = players[0];
      var secondPlayer = players[1];

      $scope.topPerson.onAccept =
        $scope.bottomPerson.onAccept = function() {
          if ($scope.topPerson.accepted) {
            GmAPI.acceptPlayer(firstPlayer.id);
          }
          if ($scope.bottomPerson.accepted) {
            GmAPI.acceptPlayer(secondPlayer.id);
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

        };
    }

    // function for managing game variables
    $scope.liveSetupGame = function(time) {
      // handle the movement logic once everything has appeared
      $scope.loading = "";
      $scope.gameState = "live";
      $scope.updated = time;
      $scope.currentTime = $scope.getCurrentTimeInterval();
      // $scope.currentTime = 35;

      $scope.bindHandlers();
      $scope.gameTime = $scope.setupGameInterval();
    }
    $scope.getCurrentTimeInterval = function() {
      var d1 = new Date();
      var currentTime = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
      return Math.floor(currentTime.getTime()/ 1000) - $scope.updated;
    }

    $scope.confirmGoHome = function() {
      $scope.previousGameState = $scope.gameState;
      $scope.gameState = "gohome";
    }
    $scope.cancelGoHome = function() {
      $scope.gameState = $scope.previousGameState;
    }

    // logic - function for making game end
    $scope.endGame = function(matchType) {
      $interval.cancel($scope.gameTime);
      $interval.cancel($scope.remainTime);
      $scope.gameState = "ended";
      if (matchType) {
        $scope.gameState = "match";
        $rootScope.$broadcast('room.setup');
        // $scope.setupMatchRoom();
      } else {
        $scope.gameState = "replay";
      }
    }
    $scope.checkState = function(state) {
      if ($scope.gameState == state) {
        return "show";
      }
      return "hidden";
    }
    $scope.changeState = function(state) {
      if ($scope.gameState == state) {
        $scope.gameState = "live";
      }
    }
    var d1 = new Date();
    var currentTime = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
    $scope.liveSetupGame(Math.floor(currentTime.getTime()/ 1000));

    $scope.acceptedName = function() {
      if ($scope.persons.topAccepted) {
        return $scope.topPerson.name;
      }
      return $scope.bottomPerson.name;
    }

    $scope.acceptedGender = function() {
      var gender = "m";
      if (($scope.persons.topAccepted && $scope.topPerson.gender == "f") || ($scope.persons.bottomAccepted && $scope.bottomPerson.gender == "f")) {
        return "her";
      }
      return "him";
    }


    $scope.$watchCollection('persons', function(person){
      if ($scope.completed) {
        return;
      }
      if(person.topAccepted == true) {
        $scope.persons.bottomRejected = true;
        $("#bottomPersonMessage").html("<p>You <span class=\"passed\">passed</span> " + $scope.bottomPerson.name).addClass("visible");
        $("#bottomPerson").addClass("message-visible");
        $scope.gameState = "waiting";
        $scope.currentTime = 35;
        $scope.topPerson.accept();
        $scope.bottomPerson.reject();
        $scope.completed = true;
      } else {
        if (person.topRejected == true) {
          $scope.topPerson.reject();
        }
        if (person.bottomAccepted == true) {
          $scope.persons.topRejected = true;
          $("#topPersonMessage").html("<p>You <span class=\"passed\">passed</span> " + $scope.topPerson.name).addClass("visible");
          $("#topPerson").addClass("message-visible");
          $scope.gameState = "waiting";
          $scope.currentTime = 35;
          $scope.bottomPerson.accept();
          $scope.topPerson.reject();
          $scope.completed = true;
        }
        else {
          if (person.bottomRejected == true) {
            $scope.bottomPerson.reject();
          }
        }
      }
    });
    // $scope.setupGame(players, 40);





    // Match functionality

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
        // $scope.secondsRemain = $scope.maxSecondsRemain - (Math.floor(currentTime.getTime()/ 1000) - time);
        $scope.secondsRemain = $scope.maxSecondsRemain;

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
      }

      $scope.setupPokeLater = function() {
        $scope.poked = true;
        $interval.cancel($scope.interval);
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
        $interval.cancel($scope.interval);
        GmAPI.roomPokeLater()
          .then(function(result) {
            $state.go('menu');
          });
      }

  $scope.liveSetupPlayers($rootScope.gameData.players);
  $scope.liveSetupGame($rootScope.gameData.updated);
}

angular.module('givmeApp.controllers')
  .controller('PlayCtrl',['$scope', '$state', '$timeout', '$interval', '$ionicLoading', 'GmAPI', 'PlayPersonPreview', '$rootScope', '$window', PlayCtrl]);