'use strict';

/**
 * Gender page controller
 * @param $scope
 * @param $state
 * @param $interval
 * @constructor
 */
function GenderCtrl($scope, $state, GmAPI) {
      /*
       * Match states
       */
      // Pending (only countdown)




      /*
       * Supportive functions
       */

      $scope.chooseGender = function(gender) {
        GmAPI.submitGender(gender)
          .then(function(response) {
            if (response.success) {
              $state.go('tutorial1');
            }
          })
      }
}

angular.module('givmeApp.controllers')
  .controller('GenderCtrl',['$scope', '$state', 'GmAPI', GenderCtrl]);