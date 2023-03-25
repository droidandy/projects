'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 */
function MenuCtrl($scope, ngFB, GmAPI, $timeout, $q, $window, $state) {
  $scope.share = function () {
    ngFB.login()
      .then(function(data) {
        ngFB.api({
          method: 'POST',
          path: '/me/feed',
          access_token: data.authResponse.accessToken,
          params: $scope.item
        })
          .then(function (data) {})
          .catch(function(data) {});
      })
      .catch(function() {
        console.log(data);
      });
  };
  $scope.goTo = function(value) {
    console.log(Date.now());
    $state.go(value);
  }

  $scope.debug = false;
  $scope.displayBG = function() {
    if ($scope.debug) {
      return "";
    }
    return " gm-content--menu";
  }

  // $scope.cameraPlus.startCamera();
  // $scope.refreshPreview();

  // var tapEnabled = false; //enable tap take picture
  // var dragEnabled = false; //enable preview box drag across the screen
  // var toBack = true; //send preview box to the back of the webview
  // var rect = {x: 0, y: 0, width: $window.innerWidth, height:$window.innerHeight};
  // try {
  //   cordova.plugins.camerapreview.startCamera(rect, "front", tapEnabled, dragEnabled, toBack)
  // } catch(e) {
  //   $scope.debug = true;
  // }

  $scope.onDragLeft = function() {
  }

      // $scope.asyncGetImage();

}

angular.module('givmeApp.controllers')
  .controller('MenuCtrl',['$scope', 'ngFB', 'GmAPI', '$timeout', '$q', '$window', '$state', MenuCtrl]);