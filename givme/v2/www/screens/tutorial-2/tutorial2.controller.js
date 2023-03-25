'use strict';

/**
 * Main page controller
 * @param $scope
 * @constructor
 * @param $rootScope
 * @param $state
 * @param $ionicSlideBoxDelegate
 * @param $timeout
 * @param $interval
 * @param Profile
 * @param PlayPersonPreview
 * @param HistorySwiper
 */
function Tutorial2Ctrl($scope, $rootScope, $state, $ionicSlideBoxDelegate, $timeout, $interval, Profile, PlayPersonPreview, HistorySwiper) {
  HistorySwiper.clearWatchesSlide();
  $rootScope.help_background = {background: 'none'};
  $scope.index = 0;

  Profile.getOrRedirect()
    .then(function(profile) {

      $timeout(function() {
        return $ionicSlideBoxDelegate.enableSlide(false);
      }, 1);

      $scope.profileData = profile;
      $scope.persons = {topAccepted: "", topRejected: "", bottomAccepted: "", bottomRejected: ""};

      $scope.newPhoto = undefined;
      $scope.swipe = "Please enter three tags";
      if ($scope.profileData.tags.length >= 3) {
        $scope.swipe = '<div class="skip-block"><a class="next-link">Done<span class="arrow-nxt-icon"></span></a> </div>';
      }

      $scope.$watchCollection('profileData.tags', function() {
        Profile.saveProfile($scope.profileData);
        if ($scope.profileData.tags.length >= 3) {
          $scope.swipe = '<div class="skip-block"><a class="next-link">Done<span class="arrow-nxt-icon"></span></a> </div>';
        }
      });

      $scope.$watchCollection('persons', function() {
        if ($scope.persons["topAccepted"] || $scope.persons["bottomAccepted"]) {
          var $flipBlock = $(".slide-flip-block");
          $scope.transition = 'none';
          //$scope.percentage = 0;
          $scope.currentTime = 0;
          $flipBlock.css('height',$flipBlock.find("img").height()+3);
          $flipBlock.flip({"axis":"x","speed":200});
          if ($scope.index < 3) {
            $scope.index += 1;
            $ionicSlideBoxDelegate.slide($scope.index, 600);
          }
        }
        $scope.persons['topAccepted'] = "";
        $scope.persons['topRejected'] = "";
        $scope.persons['bottomAccepted'] = "";
        $scope.persons['bottomRejected'] = "";
        $timeout(function() {
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        }, 50);
      });
      var photoList = [];
      $.each($scope.profileData.photos, function(index, value) {
        value.full = value.card;
        value.thumb = value.thumbnail;
        value.active = false;
        if (index < 1) {
          value.active = true;
        }
        photoList.push(value);
      })
      var tagsString = $scope.profileData.tags.slice(0,-1).join(", ")
      if ($scope.profileData.tags.length > 1) {
        tagsString += " and " + $scope.profileData.tags[$scope.profileData.tags.length-1];
      }
      var languagesString = $scope.profileData.languages.slice(0,-1).join(", ")
      if ($scope.profileData.languages.length > 1) {
        languagesString += " and " + $scope.profileData.languages[$scope.profileData.languages.length-1];
      }
      $scope.topPerson = new PlayPersonPreview({
        name: $scope.profileData.first_name,
        age: $scope.profileData.age || 0,
        domId: "topPerson",
        photos: photoList,
        languages: $scope.profileData.languages,
        iceBreakers: $scope.profileData.tags,
        tagsString: tagsString,
        languagesString: languagesString,
        gender: $scope.profileData.gender
      });
      $scope.bottomPerson = new PlayPersonPreview({
        name: $scope.profileData.first_name,
        age: $scope.profileData.age || 0,
        domId: "bottomPerson",
        photos: photoList,
        languages: $scope.profileData.languages,
        iceBreakers: $scope.profileData.tags,
        tagsString: tagsString,
        languagesString: languagesString,
        gender: $scope.profileData.gender
      });

      $scope.bottomPerson1 = new PlayPersonPreview({
        name: $scope.profileData.first_name,
        age: $scope.profileData.age || 0,
        domId: "bottomPerson1",
        photos: photoList,
        languages: $scope.profileData.languages,
        iceBreakers: $scope.profileData.tags,
        tagsString: tagsString,
        languagesString: languagesString,
        gender: $scope.profileData.gender
      });

      $scope.activateTabs = function(index) {
        $scope.index = index;
        if(index == 3) {
          $scope.swipe = '<div class="skip-block"><a class="next-link">Done<span class="arrow-nxt-icon"></span></a> </div>';
        }
        else {
          $scope.swipe = '<div class="swipe-block active">Swipe left to continue </div>';
        }
      };
      $scope.getPronoun = function(pronoun) {
        if (pronoun == "f") {
          return "she";
        }
        return "he";
      }

      $scope.done = function() {
        if ($scope.index < 1) {
          $scope.interval = $interval(function() { if (!$scope.$$phase) {
            $scope.$apply();
          } }, 500);
          var $flipBlock = $(".slide-flip-block");
          $scope.transition = 'none';
          //$scope.percentage = 0;
          $scope.currentTime = 0;
          $flipBlock.css('height',$flipBlock.find("img").height()+3);
          $flipBlock.flip({"axis":"x","speed":200});
          $ionicSlideBoxDelegate.slide(1);
          $scope.index = 1;
        }
        if($scope.index == 3){
          // $state.go('login');
          $interval.cancel($scope.interval);
          $state.go('menu');
        }
      };

      //$scope.slide = function(to) {
        // $scope.current = to;
        // $ionicSlideBoxDelegate.slide(to);
      //};
      $scope.nextSlide = function() {
        if ($scope.index < 1) {
          var $flipBlock = $(".slide-flip-block");
          $scope.transition = 'none';
          $scope.currentTime = 0;
          $flipBlock.css('height',$flipBlock.find("img").height()+3);
          $flipBlock.flip({"axis":"x","speed":200});
        }
        if ($scope.index > 0) {
          $ionicSlideBoxDelegate.next(5000);
        }

      };
      $scope.previousSlide = function() {
        $ionicSlideBoxDelegate.previous();
        $scope.done();
      }

      $scope.login = function() {
        // $state.go('login');
        $state.go('menu');
      };

    });
}

angular.module('givmeApp.controllers')
  .controller('Tutorial2Ctrl',['$scope', '$rootScope','$state', '$ionicSlideBoxDelegate', '$timeout', '$interval', 'Profile', 'PlayPersonPreview', 'HistorySwiper', Tutorial2Ctrl]);
