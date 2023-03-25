var module = angular.module('givmeApp.directive')
  .directive('append', function () {
    return {
      restrict: 'E',
      replace: true,
      link: function (scope, element, attr) {
        scope.addNetwork = function() {
          var networks = angular.element('#networks div.list');
          var newItem = angular.element('' +
          '<ion-item class="item-remove-animate item item-complex item-right-editable"> ' +
          '<div class="item-content"><input type="text" style="width: 100%;"></div>' +
          '</ion-item>');
          networks.append(newItem);
        };

        // scope.addIceBreaker = function() {
        //   var iceBreakers = angular.element('#iceBreakers div.list');
        //   var newItem = angular.element('' +
        //   '<ion-item class="item-remove-animate item item-complex item-right-editable"> ' +
        //   '<div class="item-content"><input type="text" style="width: 100%;"></div>' +
        //   '</ion-item>');
        //   iceBreakers.append(newItem);
        // };

        // scope.addLanguage = function() {
        //   var languages = angular.element('#languages div.list');
        //   var newItem = angular.element('' +
        //   '<ion-item class="item-remove-animate item item-complex item-right-editable"> ' +
        //   '<div class="item-content"><input type="text" style="width: 100%;"></div>' +
        //   '</ion-item>');
        //   languages.append(newItem);
        // };

      }
    }
  });