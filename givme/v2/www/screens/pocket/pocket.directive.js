var module = angular.module('givmeApp.directive')
  .directive('pocketDragAnimate', function($ionicGesture, $timeout, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var a =  attrs.pocketDragAnimate.trim();
        var move = (a == '' || attrs.pocketDragAnimate.match(/horizontal/));
        var startX,startY,isDown=false;
        var maxMovement = 0;
        element.bind("mousedown touchstart", function(e){
          e=(e.touches)?e.touches[0]:e.originalEvent.touches[0];//e.touches[0] is for ios
          startX = e.clientX;
          startY = e.clientY;
          isDown=true;
          maxMovement = 0;
        });

        element.bind("mousemove touchmove", function(e){
          e=(e.touches)?e.touches[0]:e.originalEvent.touches[0];//e.touches[0] is for ios
          e.classList.add('touched');
          if(isDown){
            var deltaX = e.clientX - startX;
                  // var deltaY = Math.abs(e.clientY - startY);
            if ((deltaX < 0 && deltaX < maxMovement) || deltaX > 0 && deltaX > maxMovement) {
              maxMovement = deltaX;
            }
            var tx = (move ? (deltaX) +'px' : '0');
            var translate = 'translate('+ tx +', 0)';
            element.css({
              'transform': translate,
              '-webkit-transform': translate ,
              'transition': 'all 0s'
            });

          $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
          }
        });

        element.bind("mouseup touchend", function(e){
          isDown=false;
          $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(false);
          element.css({
              'transform': 'translate(0, 0)',
              '-webkit-transform': 'translate(0, 0)',
              'transition': 'all 0.3s ease-out',
            });
          if (maxMovement > 70 || maxMovement < -70) {
            if (maxMovement < -70) {
              element[0].style.left = '0%';
              element[0].parentElement.children[0].classList.add('pocket-close-icon');
              setTimeout(function() {
                element[0].parentElement.children[0].classList.remove('pocket-close-icon');
              }, 5000);
            } else {
              element[0].style.left = '0';
              element[0].parentElement.children[0].classList.remove('pocket-close-icon');
            }
          }
        });
      }
    }
  });
