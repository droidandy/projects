var module = angular.module('givmeApp.directive')
  .directive('buttonDragAnimate', function($ionicGesture, $timeout, $state) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var a =  attrs.buttonDragAnimate.trim();
        var move = (a == '' || attrs.buttonDragAnimate.match(/horizontal/));
        $ionicGesture.on('drag', function (event) {
          var tx = 0;
          if (event.gesture.deltaX < 0) {
            var tx = 0;
          } else if (event.gesture.deltaX > 230) {
            var tx = '230px';
          } else {
            var tx = (move ? (event.gesture.deltaX) +'px' : '0');
          }
          var translate = 'translate('+ tx +', 0)';
          element.css({
            'transform': translate,
            '-webkit-transform': translate ,
            'transition': 'all 0s ease-out'

          });
        }, element);

        $ionicGesture.on('dragend', function(event) {
          if (event.gesture.distance > '130') {

            $state.go('play');
          } else {
            element.css({
              'transform': 'translate(0, 0)',
              '-webkit-transform': 'translate(0, 0)',
              'transition': 'all 0.3s ease-out',
              '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
              '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
              'transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)'
            });
          }
        }, element);
      }
    }
  });