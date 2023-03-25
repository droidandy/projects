'use strict';

/**
 * Profile card page controller
 * @param $scope
 * @param $state
 * @constructor
 */
function ProfileCardCtrl($scope, $state) {

  $scope.iceBreakers = {
    items: [
      'David Copperfield',
      'La Calatrava',
      'Fashion Shows',
      'New York'
    ],
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

  $scope.languages = {
    items: [
      'English'
    ],
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

  $scope.prevSettingsPage = function(event) {
    $state.go('settings-contact-card');
  };

}

angular.module('givmeApp.controllers')
  .controller('ProfileCardCtrl',['$scope', '$state', ProfileCardCtrl]);