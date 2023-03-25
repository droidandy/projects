angular.module('givmeApp.directive').directive('clickOff', function($parse, $document) {
  var dir = {
    compile: function($element, attr) {
      // Parse the expression to be executed
      // whenever someone clicks _off_ this element.
      var fn = $parse(attr["clickOff"]);
      return function(scope, element, attr) {
        // add a click handler to the element that
        // stops the event propagation.
        element.bind("click", function(event) {
          event.stopPropagation();
        });
        angular.element($document[0].body).bind("click", function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      };
    }
  };
  return dir;
});