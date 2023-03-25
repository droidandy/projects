'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 */
function MenuCtrl($scope, ngFB, GmAPI, $timeout, $interval, $q, $window, $state, Profile, LogoState) {
  var intervalPromise;
  LogoState.setStateAnimate();

  $scope.storeGeneralData = function (obj) {
    $window.localStorage["givme_general"] = JSON.stringify(obj);
  }

  if (!$window.localStorage["givme_general"]) {
    var generalData = {
      "notifications": true,
      "mobile_data": true,
      "vibration": true,
      "add_to_contacts": true
    }
    $scope.storeGeneralData(generalData);
  }
  $scope.generalData = JSON.parse($window.localStorage["givme_general"]);

  $scope.storeContactData = function (obj) {
    $window.localStorage["givme_contact"] = JSON.stringify(obj);
  }
  if (!$window.localStorage["givme_contact"]) {
    var contactData = {
      "phone": "",
      "facebook": "",
      "instagram": "",
      "snapchat": "",
      "skype": ""
    }
    $scope.storeContactData(contactData);
  }
  $scope.contactData = JSON.parse($window.localStorage["givme_contact"]);

  $scope.share = function () {
    ngFB.login()
      .then(function (data) {
        ngFB.api({
            method: 'POST',
            path: '/me/feed',
            access_token: data.authResponse.accessToken,
            params: $scope.item
          })
          .then(function (data) {
          })
          .catch(function (data) {
          });
      })
      .catch(function () {
      });
  };
  $scope.goTo = function (value) {
    $state.go(value);
  }

  $scope.debug = false;
  $scope.displayBG = function () {
    if ($scope.debug) {
      return "";
    }
    return " gm-content--menu";
  }
  $scope.validConnection = false;
  $scope.confirmValidConnection = function () {
    $scope.validConnection = true;
    if (!$scope.validConnection) {
      return "disabled";
    }
  }
  $scope.confirmContactData = function () {
    var total = 0;
    $.each($scope.contactData, function (value) {
      if ($scope.contactData[value].length) {
        total += 1;
      }
    });
    if (total) {
      return true;
    }
    return false;
  }
  $scope.checkValidConnection = function () {
    if (!$scope.confirmContactData()) {
      $scope.validConnection = false;
      return;
    }
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $scope.validConnection = false;
      }
      if (!$scope.generalData["mobile_data"] && navigator.connection.type != Connection.WIFI) {
        $scope.validConnection = false;
      }
      $scope.validConnection = true;
    } else { // we're using a laptop
      $scope.validConnection = true;
    }
  };
  $scope.sliderText = "Slide to Play";
  $scope.sliderClass = "";

  // $interval(function () {
  //   $scope.checkValidConnection();
  // }, 1000);

  // if room live, setup room
  $scope.$on('game.searching', function (event, args) {
    // $scope.hideVideo = false;
    // $scope.setupRoom();
    var textToShow = ["Searching", "Slide to stop"];
    $scope.sliderText = textToShow[0];
    intervalPromise = $interval(
      function () {
        if ($scope.sliderText == textToShow[0]) $scope.sliderText = textToShow[1];
        else $scope.sliderText = textToShow[0];
      },
      3000
    );
    $scope.sliderClass = "active";
    $scope.requestInProcess = true;
    GmAPI.requestGame();
  });
  $scope.$on('game.endsearching', function (event, args) {
    $scope.sliderText = "No game found";
    $scope.sliderClass = "";
    $timeout(function () {
      $scope.sliderText = "Slide to Play";
    }, 2000);
    $scope.$apply();
  });
  $scope.$on('game.live', function (event, args) {
    console.log('there');
    if ($scope.requestInProcess) $state.go("play");
  });
  $scope.$on('game.cancelled', function (event, args) {
    $scope.sliderText = "";
    $scope.sliderClass = "";
    $scope.requestInProcess = false;
    $interval.cancel(intervalPromise);
    $timeout(
      function () {
        $scope.sliderText = "Slide to Play";
      },
      1000
    );
    $scope.$apply();
  });
  // $scope.asyncGetImage();

}

angular.module('givmeApp.controllers')
  .controller('MenuCtrl', ['$scope', 'ngFB', 'GmAPI', '$timeout', '$interval', '$q', '$window', '$state', 'Profile', 'LogoState', MenuCtrl]);
