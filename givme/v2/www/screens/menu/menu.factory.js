'use strict';


function LogoState($http, $q, $window, $state, $rootScope) {
  return {
    LogoStateAnimate: true,

    setStateAnimate: function() {
      var _this = this;

      if (_this.LogoStateAnimate) {
          _this.LogoStateAnimate = false;
          $('#LogoState').addClass('animated bounceInDown');
      } else {
          $('#LogoState').removeClass('animated bounceInDown');
      }
    }

  }
}

angular.module('givmeApp.services')
  .factory('LogoState', LogoState);


