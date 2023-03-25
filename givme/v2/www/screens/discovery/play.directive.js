var module = angular.module('givmeApp.directive')
  .directive('playDragAnimate', function ($ionicGesture) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var a =  attrs.playDragAnimate.trim();
      var move = (a == '' || attrs.playDragAnimate.match(/horizontal/));
      var personType = attrs.person;
      var axis = "";
      var movementY = 0;
      var movementX = 0;
      var midPoint = 120;
      $ionicGesture.on('drag', function (event) {
        movementX = event.gesture.deltaX;
        movementY = event.gesture.deltaY;
        if (!axis && (movementX >= 5 || movementY >= 5 || movementX <= -5 || movementY <= -5)) {
          if (movementY >= 5 || movementY <= -5) {
            axis = "y";
          } else {
            axis = "x";
          }
        }
        if (axis == "x") {
          if (!$scope.persons[personType + "Accepted"] && !$scope.persons[personType + "Rejected"]) {
            var movement = event.gesture.deltaX;
            if (Math.abs(movement) > midPoint) {
              if (movement > 0) {
                movement = midPoint + (movement-midPoint) / 7;
              } else {
                movement = midPoint * -1 + (movement + midPoint) / 7;
              }
            }
            var tx = (move ? movement +'px' : '0');
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
        }
      }, element);

      $ionicGesture.on('dragend', function(event) {
        axis="";
        movementX = movementY = 0;
        element.css({
          'transform': 'translate(0, 0)',
          '-webkit-transform': 'translate(0, 0)',
          'transition': 'all 0.15s ease-out'
        });
        $("#" + personType + "PersonAccept").removeClass("selected");
        $("#" + personType + "PersonReject").removeClass("selected");
        if ($scope.persons['topAccepted'] || $scope.persons['bottomAccepted']) {
          return;
        }
        if($scope.persons[personType+"Accepted"] === "" || $scope.persons[personType+"Rejected"] === "") {
          if (event.gesture.distance > '70') {
            if (event.gesture.direction == "right") {
              $scope.persons[personType + "Accepted"] = true;
              $scope.persons[personType + "Rejected"] = false;
              $("#" + personType + "PersonMessage").html("<p>You <span class=\"selected\">selected</span> " + $scope[personType + "Person"].name).addClass("visible");
              $("#" + personType + "Person").addClass("message-visible");
            } else if (event.gesture.direction == "left") {
              $scope.persons[personType + "Accepted"] = false;
              $scope.persons[personType + "Rejected"] = true;
              $("#" + personType + "PersonMessage").html("<p>You <span class=\"passed\">passed</span> " + $scope[personType + "Person"].name).addClass("visible");
              $("#" + personType + "Person").addClass("message-visible");
            }
          }
        }
      }, element);
    }
  }
});
