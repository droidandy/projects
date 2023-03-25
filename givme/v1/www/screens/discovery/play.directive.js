var module = angular.module('givmeApp.directive')
  .directive('playDragAnimate', function ($ionicGesture) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var a =  attrs.playDragAnimate.trim();
      var move = (a == '' || attrs.playDragAnimate.match(/horizontal/));
      var personType = attrs.person;
      $ionicGesture.on('drag', function (event) {
        if (!$scope.persons[personType + "Accepted"] && !$scope.persons[personType + "Rejected"]) {
          var tx = (move ? event.gesture.deltaX +'px' : '0');
          var translate = 'translate('+ tx +', 0)';
          element.css({
            'transform': translate,
            '-webkit-transform': translate ,
            'transition': 'all 0s ease-out'
          });
          if (move && event.gesture.deltaX > 70) {
            $("#" + personType + "PersonAccept").addClass("selected");
          } else {
            $("#" + personType + "PersonAccept").removeClass("selected");
          }
          if (move && event.gesture.deltaX < -70) {
            $("#" + personType + "PersonReject").addClass("selected");
          } else {
            $("#" + personType + "PersonReject").removeClass("selected");
          }
        }
      }, element);

      $ionicGesture.on('dragend', function(event) {
        element.css({
          'transform': 'translate(0, 0)',
          '-webkit-transform': 'translate(0, 0)',
          'transition': 'all 0.3s ease-out',
          '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1)',
          '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1.515)',
          'transition-timing-function': 'cubic-bezier(0.1, 0.885, 0.470, 1.515)'
        });
        $("#" + personType + "PersonAccept").removeClass("selected");
        $("#" + personType + "PersonReject").removeClass("selected");
        if($scope.persons[personType+"Accepted"] === "" || $scope.persons[personType+"Rejected"] === "") {
          if (event.gesture.distance > '70') {
            if (event.gesture.direction == "right") {
              $scope.persons[personType + "Accepted"] = true;
              $scope.persons[personType + "Rejected"] = false;
              $("#" + personType + "PersonMessage").html("<p>You <span class=\"selected\">selected</span> Marta").addClass("visible");
              $("#" + personType + "Person").addClass("message-visible");
            } else if (event.gesture.direction == "left") {
              $scope.persons[personType + "Accepted"] = false;
              $scope.persons[personType + "Rejected"] = true;
              $("#" + personType + "PersonMessage").html("<p>You <span class=\"passed\">passed</span> Marta").addClass("visible");
              $("#" + personType + "Person").addClass("message-visible");
            }
          }
        }
      }, element);
    }
  }
});