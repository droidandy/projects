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
          //console.log("mousedown",startX,startY);
        });

        element.bind("mousemove touchmove", function(e){
          e=(e.touches)?e.touches[0]:e.originalEvent.touches[0];//e.touches[0] is for ios
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

          // if(deltaX > deltaY) {
          //console.log("horizontal move");
          $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
            // }
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
          //console.log("mouseup touchend");
        });
        // ionic.onGesture('drag', function(e) {
        //   console.log("HERE");
        //   ionic.requestAnimationFrame(function() { self._doDrag(e) });
        // }, element);

        // ionic.onGesture('dragend', function(e) {
        //   ionic.requestAnimationFrame(function() { self._doDragEnd(e) });
        // }, element);

        // _doDrag = function(e) {
        //   // var o = e.gesture.deltaY / 3;
        //   var x = e.gesture.deltaX;

        //   element.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0px, 0)';
        // },
        // _doDragEnd = function(e) {
        //   // this.transitionOut(e);
        // }
        // $ionicGesture.on('drag', function (event) {
        //   console.log("Start", Date.now())
        //   var tx = (move ? ((event.gesture.deltaX)) +'px' : '0');
        //   var translate = 'translate('+ tx +', 0)';
        //   element.css({
        //     'transform': translate,
        //     '-webkit-transform': translate ,
        //     'transition': 'all 0s'
        //   });
        //   console.log("End", Date.now())
        // }, element);

        // $ionicGesture.on('dragend', function(event) {
        //   element.css({
        //     'transform': 'translate(0, 0)',
        //     '-webkit-transform': 'translate(0, 0)',
        //     'transition': 'all 0.3s ease-out',
        //     // '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
        //     // '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
        //     // 'transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)'
        //   });
        //   if (event.gesture.distance > '70') {
        //     switch (event.gesture.direction) {
        //       case 'left': {
        //         element[0].style.left = '0%';
        //         element[0].parentElement.children[0].classList.add('pocket-close-icon');
        //         setTimeout(function() {
        //           element[0].parentElement.children[0].classList.remove('pocket-close-icon');
        //         }, 5000);
        //       }break;

        //       case 'right': {
        //         element[0].style.left = '0';
        //         element[0].parentElement.children[0].classList.remove('pocket-close-icon');
        //       }break;
        //     }
        //   }
        // }, element);
      }
    }
  });