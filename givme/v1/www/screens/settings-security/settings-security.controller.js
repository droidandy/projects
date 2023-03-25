'use strict';

/**
 * Settings page controller
 * @param $scope
 * @param $timeout
 * @param $ionicSlideBoxDelegate
 * @param Profile
 * @param Camera
 * @constructor
 */
function SettingsSecurityCtrl($scope, $timeout, $ionicSlideBoxDelegate, Profile, Camera) {

  Profile.load()
    .then(function(profile) {
      //  false - men; true - women;
      console.log(profile);
      $scope.settings = {
        profile: profile,
        age: profile.age,
        gender: profile.gender !== 'm',
        interested: profile.preferences.gender !== 'm',
        min_age: profile.preferences.min_age,
        max_age: profile.preferences.max_age,
        radius: profile.radius,
        contacts: profile.contacts
      };
      $scope.$watchCollection('settings', function() {
        $scope.settings.profile.preferences.gender  = $scope.settings.interested ? 'f' : 'm';
        $scope.settings.profile.gender              = $scope.settings.gender ? 'f' : 'm';
        $scope.settings.profile.preferences.min_age = $scope.settings.min_age;
        $scope.settings.profile.preferences.max_age = $scope.settings.max_age;
        $scope.settings.profile.radius              = $scope.settings.radius;
        $scope.settings.profile.age                 = $scope.settings.age;

        Profile.save($scope.settings.profile);
      });

      $scope.addIceBreaker = function(evt) {
        if (evt == "blur" || evt.keyCode == 13) {
          if($scope.newIceBreaker.text.length < 1) {
           return;
          }
          $scope.settings.profile.tags.push($scope.newIceBreaker.text);
          Profile.save($scope.settings.profile);
          $scope.newIceBreaker.text = '';
        }
      };

      $scope.deleteIceBreaker = function(ib) {
        $scope.settings.profile.tags.splice($scope.settings.profile.tags.indexOf(ib), 1);
        Profile.save($scope.settings.profile);
      };

      $scope.addLanguage = function(evt) {
        if (evt == "blur" || evt.keyCode == 13) {
          if($scope.newLanguage.text.length < 1) {
            return;
          }
          $scope.settings.profile.languages.push($scope.newLanguage.text);
          Profile.save($scope.settings.profile);
          $scope.newLanguage.text = '';
        }
      };

      $scope.deleteLanguage = function(lang) {
        $scope.settings.profile.languages.splice($scope.settings.profile.languages.indexOf(lang), 1);
        Profile.save($scope.settings.profile);
      };

      $scope.pictureItems = [];

      $scope.iceBreakers = {
        items: $scope.settings.profile.tags,
        shouldShowReorder: false,
        listCanSwipe: true,
        moveItem: function(item, fromIndex, toIndex) {
          this.items.splice(fromIndex, 1);
          this.items.splice(toIndex, 0, item);
        },
        deleteItem: function(index) {
          this.items.splice(index, 1);
        }
      };

      $scope.languageItems = {
        items: $scope.settings.profile.languages,
        shouldShowReorder: false,
        listCanSwipe: true,
        moveItem: function(item, fromIndex, toIndex) {
          this.items.splice(fromIndex, 1);
          this.items.splice(toIndex, 0, item);
        },
        deleteItem: function(index) {
          this.items.splice(index, 1);
        }
      };

      $scope.range = 13;

    })
    .catch(function(err) {
      console.error(err);
    });

  $scope.updateContacts = function() {
    Profile.saveContacts($scope.settings.contacts);
  };

  $scope.selectImage = function(){
    Camera.getPicture({
      quality: 100,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    })
      .then(function(imageURI){
        $scope.pictureItems.push({
          src: imageURI,
          active: false
        });
      })
      .catch(function(err) {
        console.error(err);
      })
  };

  $timeout(function() {
    var mainScroll = $ionicSlideBoxDelegate.$getByHandle('mainScroll');
    mainScroll._instances[1].slideIsDisabled = true;
  }, 200);

  $scope.slides = {
    first: true,
    second: false,
    third: false,
    fourth: false
  };

  $scope.currentIndex = 0;

  $scope.currentClass = function(index) {
    var result = index - $scope.currentIndex;
    if (result == 1) {
      return "nextSlide";
    }
    if (result == -1) {
      return "prevSlide";
    }
  };

  $scope.drag = function() {
   $scope.currentIndex = $ionicSlideBoxDelegate.selected();
   switch($scope.currentIndex) {
     case 0: {
       $scope.slides.first = true;
       $scope.slides.second = false;
     }break;
     case 1: {
       $scope.slides.first = false;
       $scope.slides.second = true;
       $scope.slides.third = false;
     }break;
     case 2: {
       $scope.slides.second = false;
       $scope.slides.third = true;
       $scope.slides.fourth = false;
     }break;
     case 3: {
       $scope.slides.third = false;
       $scope.slides.fourth = true;
     }break
   }
   setTimeout(function() { $scope.$apply(); }, 10);
  };

  $scope.newIceBreaker = {
    text: ""
  };
  $scope.newLanguage = {
    text: ""
  };
}

angular.module('givmeApp.controllers')
  .controller('SettingsSecurityCtrl', SettingsSecurityCtrl);