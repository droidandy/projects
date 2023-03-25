var module = angular.module('givmeApp.directive')
  .directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  });