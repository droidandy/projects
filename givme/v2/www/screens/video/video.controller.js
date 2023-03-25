'use strict';

/**
 * Video page controller
 * @param $scope
 * @param $rootScope
 * @param $timeout
 * @param $state
 * @param $interval
 * @param GmAPI
 * @param SecuredPopups
 * @constructor
 */
function VideoCtrl($scope, $rootScope, $state, $interval, $timeout, GmAPI, SecuredPopups) {

  $scope.addTransparency = function(){
    $('<style id="transparent" type="text/css">*:not(.tool){background: transparent!important;}</style>').appendTo(document.head);
  };
  /*
   * Room states
   */
  // Pending (only countdown)
  // initial load
  $scope.hideVideo = false;
  $scope.secondsRemain = 5 * 60; // default 5 minutes maximum
  $scope.roomState = $rootScope.roomState;
  $scope.roomData = {};
  $scope.reasonIsVisible = false; // used for reporting
  $scope.reportText = ""; // used for reporting
  $scope.stream = undefined;

  $scope.removeTransparency = function(){
    $('#transparent').remove();
  };

  $scope.showAttentionPopup = function(){
    $scope.pauseVideo();
    $scope.tempDisconnect();
    $scope.removeTransparency();
    $scope.attentionPopup = SecuredPopups.show('alert',{
      templateUrl: 'screens/video/popups/attention.html',
      title: '<div class="blue-lolly"></div>Bad flavour?',
      subTitle: 'Tell us what happened.',
      cssClass: 'animated bounceInDown',
      scope: $scope,
      buttons: [
        {
          text: 'Back',
          type: 'button-clear',
          onTap: function(){
            if(scope.stream != undefined){
              $scope.attentionPopup.close();
              $scope.setupCall();
              $scope.playVideo();
            }
            else{
              $scope.disconnect();
            }
          }
        }
      ]
    });
  };

  $scope.showReasonPopup = function(){
    $scope.attentionPopup.close();
    $scope.reasonPopup = SecuredPopups.show('alert', {
      template: '<input type="text" placeholder="Tell Us More..." ng-model="reportText">',
      title: '<div class="blue-lolly"></div>Bad flavour?',
      subTitle: 'Tell us what happened.',
      cssClass: 'animated bounceInDown',
      scope: $scope,
      buttons: [
        {
          text: 'Back',
          type: 'button-clear back',
          onTap: function(){
            $scope.reasonPopup.close();
            $scope.showAttentionPopup();
          }
        },
        {
          text: 'Send',
          type: 'button-clear send',
          onTap: function () {
            $scope.submitReport('other');
          }
        }
      ]
    });
  };

  $scope.showWeakConnectionPopup = function () {
    $scope.removeTransparency();
    $scope.weakConnectionPopup = SecuredPopups.show('alert', {
      template: 'You can wait or...',
      title: '<div class="red-lolly"></div>Brain Freeze!',
      subTitle: 'Weak connection...',
      buttons: [
        {
          text: 'End the call',
          type: 'button-clear',
          onTap: function(){
            $scope.disconnect();
            $scope.weakConnectionPopup.close();
          }
        }
      ]
    });
  };
  /*
   * Standard functions
   */
  $scope.setupRoom = function () {
    $scope.roomData = $rootScope.roomData;
    $scope.secondsRemain = $scope.calculateSecondsRemain();
    $scope.setupInterval();
    $scope.setupCall();
  };


  /*
   * Helper functions - maybe to be moved to a different location
   */
  $scope.calculateSecondsRemain = function () {
    var d1 = new Date();
    var currentTime = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
    return 300 - (Math.floor(currentTime.getTime() / 1000) - $scope.roomData.updated);
  };

  // disconnect from the session
  $scope.disconnect = function (ignoreState) {
    $scope.fullyDisconnect();
    try {
      GmAPI.roomMakeClosed()
        .then(function () {
          $("#yourVideoItem").remove();
          $interval.cancel($scope.interval);
          if (!ignoreState) {
            $scope.removeTransparency();
            $state.go('sending-contact-card');
          }
        })
    } catch (err) {
      $("#yourVideoItem").remove();
      $interval.cancel($scope.interval);
      if (!ignoreState) {
        $scope.removeTransparency();
        $state.go('sending-contact-card');
      }
    }
  };

  $scope.fullyDisconnect = function () {
    $scope.tempDisconnect();
    $("#yourVideoItem").remove();
    $scope.session.disconnect();
    $scope.publisher = undefined;
    $scope.subscriber = undefined;
    $scope.stream = undefined;
  };

  // pause video this side and the other
  $scope.pauseVideo = function () {
    $scope.session.signal({
      type: "pause"
    });
  };
  $scope.playVideo = function(){
    $scope.session.signal({
      type: "play"
    });
  };

  // manage video call
  $scope.setupCall = function () {
    $scope.image = undefined;

    var apiKey = 45489662;
    var sessionId = $scope.roomData.opentok_session;
    var token = $scope.roomData.opentok_token;

    if (!$scope.session) {
      if (OT.checkSystemRequirements() != 1) {
        return;
      }
      $scope.session = OT.initSession(apiKey, sessionId);

      $scope.session.connect(token, function (error) {
        if (error) {
          console.log(error.message);
        }
      });

    }
    $scope.session.on({
      'sessionConnected': function (event) {
        if (!$scope.publisher) {
          var publisherProperties = {
            width: 80,
            height: 100
          };
          if (!$("#yourVideoItem").length) {
            $("#videoItemContainer").html('<div id="yourVideoItem" class=""></div>');
          }
          $scope.publisher = OT.initPublisher('yourVideoItem', publisherProperties);
          $scope.session.publish($scope.publisher);
        }
      },
      'streamCreated': function (event) {
        if (!$scope.stream) {
          if (!$("#screen").length) {
            $("#screenContainer").prepend('<div id="screen" class="background-screen"></div>');
          }
          $scope.stream = event.stream;
          $scope.subscriber = $scope.session.subscribe(event.stream, "screen", {subscribeToAudio: true});
          $scope.addTransparency();
        }
      },
      'connectionDestroyed': function(event){
        //$scope.disconnect();
      },
      'signal:pause': function (event) {
        $scope.showWeakConnectionPopup();
      },
      'streamDestroyed': function(event) {
        console.log(event);
      },
      'signal:play': function (event) {
        $scope.weakConnectionPopup.close();
        $scope.addTransparency();
      }
    });
  };

  // setup interval
  $scope.setupInterval = function () {
    if ($scope.interval) {
      $interval.cancel($scope.interval);
    }
    $scope.interval = $interval(function () {
      $scope.secondsRemain--;
      if ($scope.secondsRemain == 0) {
        $scope.session.disconnect();
        $interval.cancel($scope.interval);
        if (window.plugins) {
          // window.plugins.insomnia.allowSleepAgain();
        }
      }
    }, 1000);
  };

  //$scope.is_blurred = function () {
  //  if ($scope.secondsRemain > 20) {
  //    return "blurred";
  //  }
  //  return "";
  //};

  // handle submit report
  $scope.submitReport = function (reason) {
    var data = {'reason': reason, 'image': $scope.image};
    if (reason == "other") {
      data["report"] = $scope.reportText;
    }
    GmAPI.submitReport(data)
      .then(function (response) {
        $scope.image = "";
        $scope.fullyDisconnect();
        if($scope.attentionPopup) $scope.attentionPopup.close();
        if($scope.reasonPopup) $scope.reasonPopup.close();
        $scope.removeTransparency();
        $state.go("menu");
      });
  };

  /*
   * Template functions
   */
  // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
  // Display "Report" modal
  //$scope.toggleInterrupted = function () {
  //  if ($scope.activeModal == "interrupted") {
  //    $scope.activeModal = "";
  //    $scope.setupCall();
  //  } else {
  //    $scope.activeModal = "interrupted";
  //    $scope.tempDisconnect();
  //  }
  //};

  //$scope.showAttentionModal = $ionicModal.$scope.displayReason = function () {
  //  $scope.activeModal = "reason";
  //}
  $scope.getImage = function () {
    return "data:image/png;base64," + $scope.image;
  };

  $scope.tempDisconnect = function () {
    try {
      $scope.image = $scope.subscriber.getImgData();
      $scope.pauseVideo();
      $scope.session.unpublish($scope.publisher);
      $scope.session.unsubscribe($scope.subscriber);
    } catch (err) {
    }
  };

  // OVERRIDE!!!
  $scope.roomState = "live";
  var d1 = new Date();
  var currentTime = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
  $rootScope.roomData = {
    "updated": Math.floor(currentTime.getTime() / 1000),
    "opentok_session": "2_MX40NTQ4OTY2Mn5-MTQ1NjkwODA2Nzg1Mn5WeW41WU9ta0J1NWVERC9YSlRQWjVpemp-UH4",
    "opentok_token": "T1==cGFydG5lcl9pZD00NTQ4OTY2MiZzaWc9ZjA2MTk0MjJmNTJkZDU0YzIxNmVhMTFjYTRmZDU0MTI5YTU5ZmI2NDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5UUTRPVFkyTW41LU1UUTFOamt3T0RBMk56ZzFNbjVXZVc0MVdVOXRhMEoxTldWRVJDOVlTbFJRV2pWcGVtcC1VSDQmY3JlYXRlX3RpbWU9MTQ1NjkwODA3OCZub25jZT0wLjUxMjg2ODc4NjU3NDc3OTQmZXhwaXJlX3RpbWU9MTQ1OTUwMDA2NCZjb25uZWN0aW9uX2RhdGE9",
  };


  // initial setup - broadcast should only be received by "match" controller
  switch ($scope.roomState) {
    case "live":
      $scope.setupRoom();
      break;
    case "waiting":
      $scope.setupRoom();
      break;
    case "ended":
      $scope.removeTransparency();
      $state.go("sending-contact-card");
      break;
    case "pending":
      // $state.go("match");
      break;
    default:
      // $state.go("menu");
      break;
  }
  if ($rootScope.roomState == "live") {
    $scope.hideVideo = false;
    $scope.setupRoom();
  }
  // });
  // });
}

angular.module('givmeApp.controllers')
  .controller('VideoCtrl', ['$scope', '$rootScope', '$state', '$interval', '$timeout', 'GmAPI', 'SecuredPopups', VideoCtrl]);
