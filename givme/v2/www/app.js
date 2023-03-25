'use strict';
ionic.Gestures.gestures.Hold.defaults.hold_threshold = 20;
angular.module('givmeApp', ['ionic', 'ngCordova','ng-sortable', /*'uiGmapgoogle-maps',*/'anim-in-out', 'ui-rangeSlider', 'givmeApp.controllers', 'givmeApp.services', 'givmeApp.directive', 'ngOpenFB', 'ngIOS9UIWebViewPatch' ])
.controller('AppCtrl', ['$scope', 'GmAPI', 'gmAPIServerIP', 'Profile', '$http', '$timeout', '$rootScope', '$state', function AppCtrl($scope, GmAPI, gmAPIServerIP, Profile, $http, $timeout, $rootScope, $state) {

    $scope.socket = undefined; // expecting a web socket
    $scope.currentSocketType = undefined; // @string - ['connection','game','room']
    $scope.timer = undefined;
    $scope.initialMessageReceived = false;
    $scope.roomState = undefined;
    $scope.roomData = {};
    $rootScope.passphrase = "XEDF78JQUIKLD";

    // relevant socket tyoe for current page
    $scope.returnTypeFromCurrentUrl = function(currentUrl) {
      switch (currentUrl) {
        case "play":
          return "game"
        case "video":
        case "match":
        case "sending-contact-card":
        case "poke":
        case "poked":
          return "room"
        default:
          return "connection"
      }
    };

    // handle initial socket setup
    $scope.setupSocket = function(currentUrl) {
      var type = $scope.returnTypeFromCurrentUrl(currentUrl);
      if ($scope.currentSocketType !== type) {
        if ($scope.socket) {
          $scope.socket.onmessage = undefined;
          $scope.socket = undefined;
        }
        if (GmAPI.apiKey) {
          $timeout.cancel($scope.timer);
          $scope.timer = $timeout(function() {
            $scope.socket = new WebSocket('ws://' + gmAPIServerIP + '/ws/' + type + '?token=' + GmAPI.apiKey + '&subscribe-user&echo');
            $scope.setupMessages(type);
            $scope.currentSocketType = type;
          }, 100)
        }
      }
    };

    // confirm is valid ended response (for Game)
    $scope.confirmValidEnded = function(data) {
      if (data.state != "ended") {
        return false;
      }
      var d1 = new Date();
      var currentTime = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
      currentTime = Math.floor(currentTime.getTime()/ 1000);
      if ($scope.gameState != "ended" && data.updated > currentTime - 5) {
        return true;
      }
      return false;
    }

    $scope.setupMessages = function(type) {
      switch (type) {
        case "connection":
          $scope.socket.onmessage = function(message) {
            if (message.data == "----HEARTBEAT----") {
              return;
            }
            var data = JSON.parse(message.data);
            // (not done yet)
            // poked
              // confirm function - redirect
              // cancel function - remove
              // poke_ended - display missed call
            // contacted
            if (data && data.state == "poke" ) {
              $rootScope.roomId = data.id;
              $rootScope.pokeContact = data.contact;
              $rootScope.$broadcast('room.poked');
              $rootScope.$broadcast('room.other');
              $state.go("poked");
              return;
            }
            if (data && data.accepted == false) {
              $rootScope.$broadcast('room.endpoke');
            }
          }
          break;

        // handle Game logic
        case "game":
          $scope.initialMessageReceived = false; // game states only appear if live or ended
          $scope.socket.onmessage = function(message) {
            if (message.data == "----HEARTBEAT----") {
              if (!$scope.initialMessageReceived) {
                $rootScope.$broadcast('game.pending');
                $scope.initialMessageReceived = true;
              }
              return;
            }
            $scope.initialMessageReceived = true;
            $rootScope.gameData = undefined;
            var data = JSON.parse(message.data);

            // live
            if (data.state == "live") {
              $rootScope.gameData = {
                  'players': data.players,
                  'updated': data.updated
              }
              $rootScope.$broadcast('game.live', $rootScope.gameData);
              return;
            }
            // ended
            if ($scope.confirmValidEnded(data)) {
              $rootScope.gameData = undefined;
              $rootScope.$broadcast('game.endsearching', {'match': data.match});
              $rootScope.$broadcast('game.ended', {'match': data.match});
              return;
            }
            // pending
            $rootScope.$broadcast('game.pending');
          };
          break;
        case "room":
          $scope.socket.onmessage = function(message) {
            if (message.data == "----HEARTBEAT----") {
              return;
            }
            var data = JSON.parse(message.data);

            $rootScope.roomState = data.state;
            $rootScope.roomData = data;

            if (data.state == "pending") {
              $rootScope.$broadcast('room.pending', {'updated': data.updated});
              return;
            }
            // live - display live screen
            if (data.state == "live") {
              $rootScope.$broadcast('room.live');
              return;
            }
            // poke - leave screen
            if (data.state == "poke") {
              $rootScope.$broadcast('room.pokelater');
              return;
            }
            // waiting - display paused screen
            if (data.state == "waiting") {
              $rootScope.$broadcast('room.waiting');
              $rootScope.$broadcast('room.other');
              return;
            }
            // pending - display match room
            // ended - display ended screen
            if (data.state == "ended") {
              $rootScope.$broadcast('room.ended');
              $rootScope.$broadcast('room.other');
              return;
            }
            // reported - display reported screen
            if (data.state == "reported") {
              $rootScope.$broadcast('room.reported');
              $rootScope.$broadcast('room.other');
              return;
            }

            // for "Poke" screen (not done yet)
            // poked - display poked screen
            if (data.state == "poked") {
              $rootScope.roomId = data.id;
              $rootScope.pokeContact = data.contact;
              $rootScope.$broadcast('room.poked');
              $rootScope.$broadcast('room.other');
              $state.go("poked");
              return;
            }
            // pokeleave - endpoke
            if (data.state == "endpoke") {
              $rootScope.$broadcast('room.endpoke');
              $rootScope.$broadcast('room.other');
              return;
            }
            // poketimeout - display too bad screen
            if (data.state == "poketimeout") {
              $rootScope.$broadcast('room.poketimeout');
              $rootScope.$broadcast('room.other');
              return;
            }
            // pokecancelled - display too bad screen
            if (data.state == "pokecancelled") {
              $rootScope.$broadcast('room.pokecancelled');
              $rootScope.$broadcast('room.other');
              return;
            }
            if (data.room && data.room.id) {
              $rootScope.roomId = data.room.id;
            }
          };
          break;
      }
    }

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $scope.setupSocket(toState.name);
    });

    $scope.$on('game.searching', function(event, args) {
      $scope.setupSocket("play");
    });
    $scope.$on('room.setup', function(event, args) {
      $scope.setupSocket("match");
    });
}])

.run(function($ionicPlatform, $cordovaStatusbar, ngFB) {
  ngFB.init({appId: '933760470004983'});

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.styleLightContent();
      window.StatusBar.hide();
    }
    // $cordovaStatusbar.style(3);

    //default of page transitions
    window.plugins.nativepagetransitions.globalOptions.duration = 300;
    window.plugins.nativepagetransitions.globalOptions.iosdelay = 60;
    window.plugins.nativepagetransitions.globalOptions.androiddelay = 60;
    window.plugins.nativepagetransitions.globalOptions.winphonedelay = 60;
    window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 2;
    // these are used for slide left/right only currently
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
    // $cordovaStatusbar.style(3);
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider/*, uiGmapGoogleMapApiProvider*/) {
    $ionicConfigProvider.views.transition('none');

    //uiGmapGoogleMapApiProvider.configure({
    //  //    key: 'your api key',
    //  v: '3.20', //defaults to latest 3.X anyhow
    //  libraries: 'weather,geometry,visualization'
    //});
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('home', {
      url: '/',
      templateUrl: './screens/home/home.tpl.html',
      controller: 'HomeCtrl'

      // templateUrl: 'screens/discovery/play.tpl.html',
      // controller: 'PlayCtrl'

      // templateUrl: 'screens/menu/menu.tpl.html',
      // controller: 'MenuCtrl'
    })
    .state('help', {
      url: '/help',
      templateUrl: './screens/help/help.tpl.html',
      controller: 'HelpCtrl'
    })
    .state('tutorial1', {
      url: '/tutorial1',
      templateUrl: './screens/tutorial-1/tutorial1.tpl.html',
      controller: 'Tutorial1Ctrl'
    })
    .state('tutorial2', {
      url: '/tutorial2',
      templateUrl: './screens/tutorial-2/tutorial2.tpl.html',
      controller: 'Tutorial2Ctrl'
    })
    .state('menu', {
      url: '/menu',
      templateUrl: './screens/menu/menu.tpl.html',
      controller: 'MenuCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: './screens/login/login.tpl.html',
      controller: 'LoginCtrl',
      nativeTransitions: {
        "type": "slide",
        "direction": "right"
      }
    })
    .state('settings', {
      url: '/settings',
      cache: false,
      templateUrl: './screens/settings/settings.tpl.html',
      controller: 'SettingsCtrl'
    })
    .state('settings-general', {
      url: '/settings/general',
      cache: false,
      templateUrl: './screens/settings-general/settings-general.tpl.html',
      controller: 'SettingsGeneralCtrl'
    })
    .state('settings-security', {
      url: '/settings/security',
      cache: false,
      templateUrl: './screens/settings-security/settings-security.tpl.html',
      controller: 'SettingsSecurityCtrl'
    })
    .state('settings-discovery', {
      url: '/settings/discovery',
      cache: false,
      templateUrl: './screens/settings-discovery/settings-discovery.tpl.html',
      controller: 'SettingsDiscoveryCtrl'
    })
    .state('settings-profile', {
      url: '/settings/profile',
      cache: false,
      templateUrl: './screens/settings-profile/settings-profile.tpl.html',
      controller: 'SettingsProfileCtrl'
    })
    .state('settings-contact', {
      url: '/settings/contact',
      cache: false,
      templateUrl: './screens/settings-contact/settings-contact.tpl.html',
      controller: 'SettingsContactCtrl'
    })
    .state('settings-contact-slug', {
      url: '/settings/contact/:slug',
      cache: false,
      templateUrl: './screens/settings-contact/settings-contact.tpl.html',
      controller: 'SettingsContactCtrl'
    })
    .state('settings-legal', {
      url: '/settings/legal',
      cache: false,
      templateUrl: './screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-privacy', {
      url: '/settings/legal/privacy',
      cache: false,
      templateUrl: './screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-terms', {
      url: '/settings/legal/terms',
      cache: false,
      templateUrl: './screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-contact-us', {
      url: '/settings/legal/contact-us',
      cache: false,
      templateUrl: './screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-discovery-card', {
      url:'/settings/discovery/card',
      cache: false,
      templateUrl: './screens/discovery-card/discovery-card.tpl.html',
      controller: 'DiscoveryCardCtrl'
    })
    .state('settings-contact-card', {
      url:'/settings/contact/card',
      cache: false,
      templateUrl: './screens/contact-card/contact-card.tpl.html',
      controller: 'ContactCardCtrl'
    })
    .state('settings-profile-card', {
      url:'/settings/profile/card',
      cache: false,
      templateUrl: './screens/profile-card/profile-card.tpl.html',
      controller: 'ProfileCardCtrl'
      })
    .state('play', {
      url: '/play',
      cache: false,
      templateUrl: './screens/discovery/play.tpl.html',
      controller: 'PlayCtrl'
    })
    .state('video', {
      url: '/room/:roomId',
      cache: false,
      templateUrl: 'screens/video/video.tpl.html',
      controller: 'VideoCtrl'
    })
    .state('pocket', {
      url: '/pocket',
      cache: false,
      templateUrl: './screens/pocket/pocket.tpl.html',
      controller: 'PocketCtrl'
    })
    .state('match', {
      url: '/match',
      cache: false,
      templateUrl: './screens/match/match.tpl.html',
      controller: 'MatchCtrl'
    })
    .state('gender', {
      url: '/gender',
      cache: false,
      templateUrl: './screens/gender/gender.tpl.html',
      controller: 'GenderCtrl'
    })
    .state('poke', {
      url: '/poke',
      cache: false,
      templateUrl: './screens/poke/poke.tpl.html',
      controller: 'PokeCtrl'
    })
    .state('poked', {
      url: '/poked',
      cache: false,
      templateUrl: './screens/poked/poked.tpl.html',
      controller: 'PokedCtrl'
    })
    .state('sending-contact-card', {
      url: '/sending/contact/card',
      cache: false,
      templateUrl: './screens/sending-contact-card/sending-contact-card.tpl.html',
      controller: 'SendingContactCardCtrl'
    })
    .state('receive-contact-card', {
      url: '/receive/contact/card',
      cache: false,
      templateUrl: './screens/receive-contact-card/receive-contact-card.tpl.html',
      controller: 'ReceiveContactCardCtrl'
    })
    .state('confirm-passcode', {
      url: '/confirmpasscode',
      cache: false,
      templateUrl: './screens/confirm-passcode/confirm-passcode.tpl.html',
      controller: 'ConfirmPasscodeCtrl'
    })
    .state('change-passcode', {
      url: '/changepasscode',
      cache: false,
      templateUrl: './screens/change-passcode/change-passcode.tpl.html',
      controller: 'ChangePasscodeCtrl'
    })
    .state('add-passcode', {
      url: '/addpasscode',
      cache: false,
      templateUrl: './screens/add-passcode/add-passcode.tpl.html',
      controller: 'AddPasscodeCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});

angular.module('givmeApp.controllers', []);
angular.module('givmeApp.services', []);
angular.module('givmeApp.directive', []);

document.addEventListener('deviceready', function () {
  // Android customization
  cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
  // Enable background mode
  cordova.plugins.backgroundMode.enable();

  // Called when background mode has been activated
  cordova.plugins.backgroundMode.onactivate = function () {
    setTimeout(function () {
      // Modify the currently displayed notification
      cordova.plugins.backgroundMode.configure({
        text:'Running in background for more than 5s now.'
      });
    }, 5000);
  }
}, false);
