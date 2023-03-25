'use strict';

/**
 * Video page controller
 * @param $scope
 * @param $timeout
 * @param $state
 * @param $interval
 * @constructor
 */
function VideoCtrl($scope, $state, $interval, $timeout) {
  if(window.plugins) {
    window.plugins.insomnia.keepAwake();
  }
  var addTransparent = $interval(function() {
    var ele = document.querySelectorAll('*:not(.kostyl)');
    for(var i = 0; i < ele.length; i++) {
      ele[i].style.background = 'transparent';
    }
  }, 1000);

  $scope.secondsRemain = 5 * 60;
  $scope.hideVideo = false;

  var interval = $interval(function() {
    $scope.secondsRemain--;
    if($scope.secondsRemain == 0) {
      session.disconnect();
      if(window.plugins) {
        window.plugins.insomnia.allowSleepAgain();
      }
      $interval.cancel(addTransparent);
      $interval.cancel(interval);
      $state.go('sending-contact-card');
    }
  }, 1000);

  var apiKey = 45342502;
  //  @todo: Should be received from back-end
  var sessionId = '1_MX40NTM0MjUwMn5-MTQ0MjMwMDI2MzYzMH5RQU5EZFBac0VJTDBtejdGWUVkZTBKQ0x-UH4';
  var token = 'T1==cGFydG5lcl9pZD00NTM0MjUwMiZzaWc9MTFlNmM3ZWU2MDgwMGU5YzEyZjdjZDYyNjg3Y2RkNjMzM2RkMGYxYjpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UTTBNalV3TW41LU1UUTBNak13TURJMk16WXpNSDVSUVU1RVpGQmFjMFZKVERCdGVqZEdXVVZrWlRCS1EweC1VSDQmY3JlYXRlX3RpbWU9MTQ0NDI4NzY4MCZub25jZT0wLjEyMTc4NzUxMDA2OTYyODE4JmV4cGlyZV90aW1lPTE0NDQzNzQwODA=';
  if (OT.checkSystemRequirements() == 1) {
    var session = OT.initSession(apiKey, sessionId);
    $scope.session = session;

    session.connect(token, function(error) {
      if (error) {
        console.log(error.message);
      }
    });

    session.on({
      sessionConnected: function(event) {
        console.log('connected to session');
        var publisherProperties = {
          width: 80,
          height: 100
        };

        var publisher = OT.initPublisher('list', publisherProperties);
        session.publish(publisher);
      },
      streamCreated: function(event) {
        var stream = event.stream;
        session.subscribe(stream, 'screen', {
          insertMode: 'append',
          height: window.innerHeight,
          width: window.innerWidth
        });
      }
    });
  } else {
    alert('The client does not support WebRTC');
  }

  $scope.disconnect = function() {
    $scope.session.disconnect();
    $interval.cancel(addTransparent);
    $interval.cancel(interval);
    $state.go('sending-contact-card');
  };


  //@todo: rewrite this...
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    $('#interrupted').on('show.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = true;
      });
      $('#info_link').removeClass('info-icon');
      $('div.relative img:eq(0)').attr('src', "img/blurd-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').hide();
    }).on('hide.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = false;
      });
      $('#info_link').addClass('info-icon');
      $('div.relative img:eq(0)').attr('src', "img/video-chat-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').show();
    });

    $('#reason').on('show.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = true;
      });
      $('div.relative img:eq(0)').attr('src', "img/blurd-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').hide();
    }).on('hide.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = true;
      });
      $('div.relative img:eq(0)').attr('src', "img/video-chat-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').show();
    });

    $('#weakConnection').on('show.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = true;
      });
      $('div.relative img:eq(0)').attr('src', "img/blurd-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').hide();
    }).on('hide.bs.modal', function () {
      $scope.$apply(function() {
        $scope.hideVideo = true;
      });
      $('div.relative img:eq(0)').attr('src', "img/video-chat-pic.png");
      $('div.relative div.chat-thumb img:eq( 0 )').show();
    });
  });
}

angular.module('givmeApp.controllers')
  .controller('VideoCtrl',['$scope', '$state', '$interval', '$timeout', VideoCtrl]);