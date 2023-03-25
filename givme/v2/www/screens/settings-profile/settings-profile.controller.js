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
function SettingsProfileCtrl($scope, $timeout, $ionicSlideBoxDelegate, $stateParams, $window, Profile, Camera) {

  Profile.reloadGetOrRedirect()
    .then(function(profile) {
      $scope.data = {
        allowScroll : false
      }


      $scope.profileData = profile;
      // $scope.profileData = JSON.parse($window.localStorage["givme_profile"]);
      $scope.newPhoto = undefined;

      $scope.$watchCollection('profileData', function() {
        Profile.saveProfile($scope.profileData);
      });
      $scope.$watchCollection('profileData.tags', function() {
        Profile.saveProfile($scope.profileData);
      });
      $scope.$watchCollection('profileData.languages', function() {
        Profile.saveProfile($scope.profileData);
      });
      $scope.$watchCollection('profileData.photos', function() {
        Profile.saveProfile($scope.profileData);
      });

      $scope.reorderItem = undefined;

      $scope.newImage = {};
      $scope.deletedImage = {};

      $scope.addIceBreaker = function(evt) {
        if (evt == "blur" || evt.keyCode == 13) {
          if($scope.newIceBreaker.text.length < 1) {
           return;
          }
          if ($scope.profileData['tags'].indexOf($scope.newIceBreaker.text) < 0) {
            $scope.profileData['tags'].push($scope.newIceBreaker.text);
          }
          // Profile.save($scope.profileData);
          $scope.newIceBreaker.text = '';
        }
      };

      $scope.deleteIceBreaker = function(ib) {
        $scope.profileData.tags.splice($scope.profileData.tags.indexOf(ib), 1);
        // Profile.save($scope.profileData);
      };

      $scope.addLanguage = function(evt) {
        if (evt == "blur" || evt.keyCode == 13) {
          if($scope.newLanguage.text.length < 1) {
            return;
          }
          if ($scope.profileData.languages.indexOf($scope.newLanguage.text) < 0) {
            $scope.profileData.languages.push($scope.newLanguage.text);
          }
          // Profile.save($scope.profileData);
          $scope.newLanguage.text = '';
        }
      };

      $scope.deleteLanguage = function(lang) {
        $scope.profileData.languages.splice($scope.profileData.languages.indexOf(lang), 1);
        // Profile.save($scope.profileData);
      };

      $scope.showReorder = function(value) {
        if (value == $scope.reorderItem) {
          return true;
        }
        return false;
      }
      $scope.toggleShowReorder = function(value) {
        if (value == $scope.reorderItem) {
          $scope.reorderItem = undefined;
        } else {
          $scope.reorderItem = value;
        }
      }

      $scope.pictureItems = $scope.profileData.photos;

      $scope.iceBreakers = {
        items: $scope.profileData.tags,
        shouldShowReorder: false,
        listCanSwipe: true,
        moveItem: function(item, fromIndex, toIndex) {
          this.items.splice(fromIndex, 1);
          this.items.splice(toIndex, 0, item);
        },
        onReorder: function (fromIndex, toIndex) {
          var moved = this.items.splice(fromIndex, 1);
          this.items.splice(toIndex, 0, moved[0]);
        },
        deleteItem: function(index) {
          this.items.splice(index, 1);
        }
      };

      $scope.languageItems = {
        items: $scope.profileData.languages,
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

      $scope.submitForm = function() {
        var formData = new FormData($('#pictureForm')[0]);
        Profile.savePhoto(formData)
          .then(function(response) {
            $scope.profileData.photos = response.photos;
            $scope.newImage = $scope.profileData.photos[$scope.profileData.photos.length-1];
            $scope.pictureItems.unshift($scope.profileData.photos[$scope.profileData.photos.length-1]);
            setTimeout(function() {
              $scope.$apply();
            }, 50);
          })
            .finally(function () {
                //$('.settings .slider-thumb li:nth-last-child(2)').removeClass('animated pulse visible');
                $('.settings .slider-thumb li:nth-last-child(2)').addClass('animated pulse visible');
            })
      }

      $scope.selectImage = function(){
        Camera.getPicture({
          quality: 100,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        })
          .then(function(imageURI){
            $scope.profileData.photos.push({
              src: imageURI,
              active: false
            });
          })
          .catch(function(err) {
            console.error(err);
          })
      };

      $scope.newIceBreaker = { text: "" };
      $scope.newLanguage = { text: "" };
      $scope.activeImage = undefined;
      $scope.handleImage = function(img) {
        $scope.newImage = {};
        if (img != $scope.activeImage) {
          $scope.activeImage = img;
          return;
        }
        Profile.deletePhoto(img.id)
          .then(function(response) {
            $scope.profileData.photos = response.photos;
            $scope.deletedImage = $scope.pictureItems[$scope.pictureItems.indexOf(img)];
            $scope.activeImage = {};
            setTimeout(function() {
              $scope.pictureItems.splice($scope.pictureItems.indexOf(img),1);
              $scope.$apply();
            }, 500);
          })
      }
      $scope.imageClass = function(img) {
        if (img == $scope.newImage) {
          return "image-pop";
        }
        if (img == $scope.deletedImage) {
          return "image-deleted";
        }
      }
      $scope.isActiveImage = function(img) {
        if (img == $scope.activeImage) {
          return "active";
        }
        if (img == $scope.deletedImage) {
          return "deleted";
        }
      }

    })
    .catch(function(err) {
      console.error(err);
    });

}

angular.module('givmeApp.controllers')
  .controller('SettingsProfileCtrl', SettingsProfileCtrl);
