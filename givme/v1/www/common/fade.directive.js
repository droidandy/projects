'use strict';

/**
 * Directive for fade in-out animation while image src change
 * @returns {{restrict: string, link: Function}}
 */

var NG_HIDE_ADD = 'ng-hide-add';
var NG_HIDE_ADD_ACTIVE = 'ng-hide-add-active';

function fade($timeout) {
  return {
    restrict: 'A',
    scope: {
      fade: '='
    },
    link: function(scope, element, attrs){
      element.addClass(NG_HIDE_ADD);
      scope.$watch('fade', function(newvalue) {
        if(newvalue) {
          element.addClass(NG_HIDE_ADD_ACTIVE);
        }
      });
      element.on('load', function() {
        $timeout(function () {
          element.removeClass(NG_HIDE_ADD_ACTIVE);
          scope.fade = false;
        }, 200);
      });
    }
  }
}


angular.module('givmeApp.services')
  .directive('fade', ['$timeout', fade]);

angular.module('givmeApp.services')
  .directive('goNative', ['$ionicGesture', '$ionicPlatform', function($ionicGesture, $ionicPlatform) {
  return {
  restrict: 'A',

  link: function(scope, element, attrs) {

    $ionicGesture.on('tap', function(e) {

    var direction = attrs.direction;
    var transitiontype = attrs.transitiontype;

    $ionicPlatform.ready(function() {

      switch (transitiontype) {
      case "slide":
        window.plugins.nativepagetransitions.slide({
          "direction": direction
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
        break;
      case "flip":
        window.plugins.nativepagetransitions.flip({
          "direction": direction
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
        break;
        
      case "fade":
        window.plugins.nativepagetransitions.fade({
          
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
        break;

      case "drawer":
        window.plugins.nativepagetransitions.drawer({
          "origin"         : direction,
          "action"         : "open"
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
        break;
        
      case "curl":
        window.plugins.nativepagetransitions.curl({
          "direction": direction
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
        break;        
        
      default:
        window.plugins.nativepagetransitions.slide({
          "direction": direction
        },
        function(msg) {
          console.log("success: " + msg)
        },
        function(msg) {
          alert("error: " + msg)
        }
        );
      }


    });
    }, element);
  }
  };
}]);
