'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 * @param $rootScope
 * @param $state
 * @param $ionicSlideBoxDelegate
 */
function Tutorial1Ctrl($scope, $rootScope, $state, $ionicSlideBoxDelegate,HistorySwiper) {
  HistorySwiper.clearWatchesSlide();
  $rootScope.help_background = {background: 'none'};
  $scope.swipe = "Swipe to continue";
  $scope.index = 0;
  $scope.activateTabs = function(index) {
    HistorySwiper.setLocalWatchedSlide(index);

    $scope.index = index;
    $("#tutorial1Slider").attr("class", "page page-slider slider-" + index);

    if(index == 3) {
      $scope.swipe = '<div class="skip-block"><a class="next-link animate-fade">Let\'s Start</a></div>';

    }else if (index == 2)  {
      if (HistorySwiper.getWatchesSlide().length >=2) {
        console.log(typeof HistorySwiper.getWatchesSlide()[HistorySwiper.getWatchesSlide().length - 2]);
        console.log(HistorySwiper.getWatchesSlide()[HistorySwiper.getWatchesSlide().length - 2]);
        if (HistorySwiper.getWatchesSlide()[HistorySwiper.getWatchesSlide().length - 2] === 3) {
          $scope.swipe = '<div class="skip-block"><a class="next-link animate-fade">Skip<span class="arrow-nxt-icon"></span></a></div>';

        }else {
          $scope.swipe = '<div class="skip-block"><a class="next-link">Skip<span class="arrow-nxt-icon"></span></a></div>';
        }

      }
    }else {
      $scope.swipe = '<div class="skip-block"><a class="next-link">Skip<span class="arrow-nxt-icon"></span></a></div>';
    }
  };

  $scope.done = function() {
    $state.go('tutorial2');
  };

  $scope.slide = function(to) {
    $scope.current = to;
    $ionicSlideBoxDelegate.slide(to);
  };

  $scope.login = function() {
    // $state.go('login');
    $state.go('menu');
  };
  $scope.swipe = '<div class="skip-block"><a class="next-link">Skip<span class="arrow-nxt-icon"></span></a></div>';
}

angular.module('givmeApp.controllers')
  .controller('Tutorial1Ctrl',['$scope', '$rootScope','$state', '$ionicSlideBoxDelegate','HistorySwiper', Tutorial1Ctrl]);
