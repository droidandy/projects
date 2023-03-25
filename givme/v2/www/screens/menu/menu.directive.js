var module = angular.module('givmeApp.directive')
  .directive('buttonDragAnimate', function($ionicGesture, $timeout, $state, $rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var a =  attrs.buttonDragAnimate.trim();
        var move = (a == '' || attrs.buttonDragAnimate.match(/horizontal/));
        $ionicGesture.on('drag', function (event) {
          var tx = 0;
          var tox = 0;
          if (event.gesture.deltaX < 0) {
            var tx = 0;
            var tox = 0;
          } else if (event.gesture.deltaX > 200) {
            var tx = '200px';
            var tox = 1;
          } else {
            var tx = (move ? (event.gesture.deltaX) +'px' : '0');
            var tox = (move ? (event.gesture.deltaX)/100 : '0');
          }
          var translate = 'translate('+ tx +', 0)';
          element.css({
            'transform': translate,
            '-webkit-transform': translate ,
            'transition': 'all 0s ease-out'

          });
          $('.slide-to-play-text').css ({'opacity': 1-tox })
        }, element);

        $ionicGesture.on('dragend', function(event) {
          if(!$(event.target).siblings('span').hasClass('active')){
            toggleButton($rootScope, element,'game.searching');
          }
          else{
            toggleButton($rootScope, element,'game.cancelled');
          }
        }, element);
      }
    }
  });


function toggleButton($rootScope, element, gameEvent){
  if (event.gesture.distance > '190') {
    $rootScope.$broadcast(gameEvent);
    element.css({
      'transform': 'translate(0, 0)',
      '-webkit-transform': 'translate(0, 0)',
      'transition': 'all 1.5s ease-out',
      '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
      'transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)'
    });
    $('.slide-to-play-text').animate({'opacity': 1 }, 350);
  } else {
    element.css({
      'transform': 'translate(0, 0)',
      '-webkit-transform': 'translate(0, 0)',
      'transition': 'all 1.5s ease-out',
      '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
      'transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)'
    });
    $('.slide-to-play-text').animate({'opacity': 1 }, 350);
  }
}
