'use strict';

angular.module('givmeApp', ['ionic', 'ngCordova', /*'uiGmapgoogle-maps',*/'anim-in-out', 'ui-rangeSlider', 'givmeApp.controllers', 'givmeApp.services', 'givmeApp.directive', 'ngOpenFB' ])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '898908930181474'});

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    //default of page transitions
    window.plugins.nativepagetransitions.globalOptions.duration = 300;
    window.plugins.nativepagetransitions.globalOptions.iosdelay = 60;
    window.plugins.nativepagetransitions.globalOptions.androiddelay = 60;
    window.plugins.nativepagetransitions.globalOptions.winphonedelay = 60;
    window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 2;
    // these are used for slide left/right only currently
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;

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
      cache: false,
      url: '/',

      // templateUrl: 'screens/home/home.tpl.html',
      // controller: 'HomeCtrl'
      // templateUrl: 'screens/discovery/play.tpl.html',
      // controller: 'PlayCtrl'

      templateUrl: 'screens/menu/menu.tpl.html',
      controller: 'MenuCtrl'
    })
    .state('help', {
      cache: false,
      url: '/help',
      templateUrl: 'screens/help/help.tpl.html',
      controller: 'HelpCtrl'
    })
    .state('menu', {
      cache: false,
      url: '/menu',
      templateUrl: 'screens/menu/menu.tpl.html',
      controller: 'MenuCtrl'
    })
    .state('login', {
      cache: false,
      url: '/login',
      templateUrl: 'screens/login/login.tpl.html',
      controller: 'LoginCtrl'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'screens/settings/settings.tpl.html',
      controller: 'SettingsCtrl'
    })
    .state('settings-general', {
      url: '/settings/general',
      templateUrl: 'screens/settings-general/settings-general.tpl.html',
      controller: 'SettingsGeneralCtrl'
    })
    .state('settings-security', {
      url: '/settings/security',
      templateUrl: 'screens/settings-security/settings-security.tpl.html',
      controller: 'SettingsSecurityCtrl'
    })
    .state('settings-discovery', {
      url: '/settings/discovery',
      templateUrl: 'screens/settings-discovery/settings-discovery.tpl.html',
      controller: 'SettingsDiscoveryCtrl'
    })
    .state('settings-profile', {
      url: '/settings/profile',
      templateUrl: 'screens/settings-profile/settings-profile.tpl.html',
      controller: 'SettingsProfileCtrl'
    })
    .state('settings-contact', {
      url: '/settings/contact',
      templateUrl: 'screens/settings-contact/settings-contact.tpl.html',
      controller: 'SettingsContactCtrl'
    })
    .state('settings-contact-slug', {
      url: '/settings/contact/:slug',
      templateUrl: 'screens/settings-contact/settings-contact.tpl.html',
      controller: 'SettingsContactCtrl'
    })
    .state('settings-legal', {
      url: '/settings/legal',
      templateUrl: 'screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-privacy', {
      url: '/settings/legal/privacy',
      templateUrl: 'screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-terms', {
      url: '/settings/legal/terms',
      templateUrl: 'screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-contact-us', {
      url: '/settings/legal/contact-us',
      templateUrl: 'screens/settings-legal/settings-legal.tpl.html',
      controller: 'SettingsLegalCtrl'
    })
    .state('settings-discovery-card', {
      url:'/settings/discovery/card',
      templateUrl: 'screens/discovery-card/discovery-card.tpl.html',
      controller: 'DiscoveryCardCtrl'
    })
    .state('settings-contact-card', {
      url:'/settings/contact/card',
      templateUrl: 'screens/contact-card/contact-card.tpl.html',
      controller: 'ContactCardCtrl'
    })
    .state('settings-profile-card', {
      url:'/settings/profile/card',
      templateUrl: 'screens/profile-card/profile-card.tpl.html',
      controller: 'ProfileCardCtrl'
      })
    .state('play', {
      cache: false,
      url: '/play',
      templateUrl: 'screens/discovery/play.tpl.html',
      controller: 'PlayCtrl'
    })
    .state('video', {
      cache: false,
      url: '/room/:roomId',
      templateUrl: 'screens/video/video.tpl.html',
      controller: 'VideoCtrl'
    })
    .state('pocket', {
      url: '/pocket',
      templateUrl: 'screens/pocket/pocket.tpl.html',
      controller: 'PocketCtrl'
    })
    .state('match', {
      cache: false,
      url: '/match',
      templateUrl: 'screens/match/match.tpl.html',
      controller: 'MatchCtrl'
    })
    .state('sending-contact-card', {
      cache: false,
      url: '/sending/contact/card',
      templateUrl: 'screens/sending-contact-card/sending-contact-card.tpl.html',
      controller: 'SendingContactCardCtrl'
    })
    .state('receive-contact-card', {
      cache: false,
      url: '/receive/contact/card',
      templateUrl: 'screens/receive-contact-card/receive-contact-card.tpl.html',
      controller: 'ReceiveContactCardCtrl'
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