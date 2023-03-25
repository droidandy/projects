'use strict';

/**
 * Contact card page controller
 * @param $scope
 * @param $state
 * @param $window
 * @param GmAPI
 * @param Profile
 * @constructor
 */
function SendingContactCardCtrl($scope, $state, $window, GmAPI, Profile, SecuredPopups) {

  Profile.getOrRedirect()
    .then(function(profile) {
      $scope.contactData = profile.contacts;

      $scope.canProgress = false;
      $scope.showMessage = false;
      $scope.showComplete = false;

      $scope.toSend = {
          phone_number: false,
          facebook: false,
          instagram: false,
          skype: false,
          snapchat: false,
          message: ""
      };

      $scope.$watch('toSend', function () {
          for (var item in $scope.toSend) {
              item = $scope.toSend[item];

              if (item) {
                  $scope.canProgress = true;
                  return;
              }
              else
                  $scope.canProgress = false;
          }
      }, true);

      $scope.showKeepInTouchPopup = function(){
        $scope.keepInTouchPopup = SecuredPopups.show('alert', {
          templateUrl: 'screens/sending-contact-card/popups/keep-in-touch.html',
          title: '<div class="red-twin-lolly"></div>Keep in touch?',
          subTitle: 'Send your contact card!',
          cssClass: 'animated bounceInDown',
          scope: $scope,
          buttons: [
            {
              text: 'Back',
              type: 'button-clear back',
              onTap: function(){
                $scope.goToMenu();
              }
            },
            {
              text: $scope.canProgress ? 'Send' : 'Next',
              type: 'button-clear send',
              onTap: function () {
                $scope.showMessagePopup();
              }
            }
          ]
        });
      };

      $scope.showMessagePopup = function(){
        $scope.messagePopup = SecuredPopups.show('alert', {
          templateUrl: 'screens/sending-contact-card/popups/message.html',
          title: '<div class="red-twin-lolly"></div>Make it sweet',
          subTitle: 'Add a message below.',
          cssClass: 'animated bounceInDown',
          scope: $scope,
          buttons: [
            {
              text: 'Back',
              type: 'button-clear back',
              onTap: function(){
                $scope.messagePopup.close();
                $scope.showKeepInTouchPopup();
              }
            },
            {
              text: 'Send',
              type: 'button-clear send',
              onTap: function () {
                $scope.sendMessage();
                $scope.keepInTouchPopup.close();
                $scope.showCompletePopup();
              }
            }
          ]
        });
      };

      $scope.showCompletePopup = function(){
        $scope.completePopup = SecuredPopups.show('alert', {
          templateUrl: 'screens/sending-contact-card/popups/complete.html',
          title: '<img src="img/coffee-glass-icon.png" width="42" height="52" alt=""><div>Sent!</div>',
          cssClass: 'animated bounceInDown',
          scope: $scope,
          buttons: [
            {
              text: 'Home',
              type: 'button-clear back',
              onTap: function(){
                $scope.completePopup.close();
                $scope.goToMenu();
              }
            },
            {
              text: 'Play',
              type: 'button-clear send',
              onTap: function () {
                $scope.completePopup.close();
                $scope.goToPlay();
              }
            }
          ]
        });
      };

      $scope.showKeepInTouchPopup();

      $scope.messageModal = function () {
          $scope.showMessage = true;
      };

      $scope.hideMessageModal = function () {
          $scope.showMessage = false;
      };

      $scope.sendMessage = function () {
        var data = $scope.toSend;
        GmAPI.sendContactDetails(data)
          .then(function() {
          });
        $scope.showComplete = true;
        $scope.showMessage = false;
        // $state.go('menu');
      };
      $scope.goToMenu = function () {
        $state.go('menu');
      };
      $scope.goToPlay = function() {
        $state.go('menu');
      }

      $scope.displayComplete = function() {
        if ($scope.showComplete) {
          return "show";
        }
        return "hidden";
      }

    $scope.activeNetworks = {};
    $scope.active = false;
    $scope.activate = function(network) {
      $scope.activeNetworks[network.target.text] = !$scope.activeNetworks[network.target.text];
      var hashKeys = Object.keys($scope.activeNetworks);
      for( var i=0, l=hashKeys.length; i<l; ++i ) {
        if($scope.activeNetworks[ hashKeys[i] ]) {
          $scope.active = true;
          return;
        }
        else
          $scope.active = false;
      }
    }
  });
}

angular.module('givmeApp.controllers')
  .controller('SendingContactCardCtrl',['$scope','$state', '$window', 'GmAPI', 'Profile', 'SecuredPopups', SendingContactCardCtrl]);
