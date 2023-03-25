'use strict';


function HistorySwiper($http, $q, $window, $state, $rootScope) {
  return {
    historyCash: null,
    setLocalWatchedSlide: function(slide) {
      var _this = this;

      var  gameSavedWatch = $window.localStorage.getItem('givme_HistorySwiper');
      var objectmas =[];
      if (gameSavedWatch === null) {
        objectmas.push(slide);
      } else {
        objectmas = JSON.parse(gameSavedWatch);
        objectmas.push(slide);
      }
      $window.localStorage.setItem('givme_HistorySwiper', JSON.stringify(objectmas));
      _this.historyCash = objectmas;

      return _this.historyCash;
    },
    getWatchesSlide: function() {
      var _this = this;
      var objectmas = JSON.parse($window.localStorage.getItem('givme_HistorySwiper')) ||  _this.historyCash;
      if (objectmas === null) {
        return [];
      } else {
        return objectmas;
      }
    },
    inWatchedSlide: function(what, where) {
      for (var i = 0; i < where.length; i++) {
        if (what === where[i]) return true;
      }
      return false;
    },
    clearWatchesSlide: function() {
      var objectmas = JSON.parse($window.localStorage.getItem('givme_HistorySwiper'));
      if (objectmas === null) {
        $window.localStorage.setItem('givme_HistorySwiper', JSON.stringify([]));
      } else {
        $window.localStorage.removeItem('givme_HistorySwiper');
      }
    }

  }
}

angular.module('givmeApp.services')
  .factory('HistorySwiper', HistorySwiper);


