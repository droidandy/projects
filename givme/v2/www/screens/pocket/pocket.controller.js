'use strict';

/**
 * Pocket page controller
 * @param $scope
 * @constructor
 * @param $location
 * @param $ionicScrollDelegate
 */
function PocketCtrl($scope, $rootScope, $location, $ionicScrollDelegate, $state, GmAPI, Profile, gmAPIServerIP/*, uiGmapGoogleMapApi*/) {
  Profile.reloadGetOrRedirect()
    .then(function(profile) {
      $scope.contactData = profile.contacts;
      $scope.top = 20;
      $scope.images = [
        {"src": 'img/img-01.png', "name": "Chiara, 28", "telephone": "+380967902339" },
        {"src": 'img/img-02.png', "name": "Serena, 23"},
        {"src": 'img/img-03.png', "name": "Emily, 28"},
        {"src": 'img/img-01.png', "name": "Chiara1, 28"},
        {"src": 'img/img-02.png', "name": "Serena1, 23"},
        {"src": 'img/img-03.png', "name": "Emily1, 28"}
      ];
      $scope.poke = function(person) {
        $rootScope.poking = person.contact;
        GmAPI.requestPokedRoom(person.contact.id)
          .then(function(response) {
            if (response.success) {
              $state.go("poke");
            } else {
              alert("Hmmm, there was an error");
            }
          });
      };
      $scope.gmAPIServerIP = gmAPIServerIP;
      $scope.pokes = profile.pokes;
      $scope.pocket = [
        {
          "img": "img/avatar.png",
          "name": "Mary Ellen",
          "contact": "Hey, nice to meet you!",
          "time": "1:23 PM",
          "alert": true,
          "contacts": {
            "phone": "+447894563899",
            "skype": "@olligopoly",
            "facebook": "obolland",
            "instagram": "@jbcoleltd",
            "snapchat": "@olligopoly"
          }
        },
        {
          "img": "img/avatar.png",
          "name": "Jane",
          "contact": "Listen, just...call me.",
          "time": "3:23 PM",
          "alert": false,
          "contacts": {
            "phone": "+447894563899",
            "skype": "@olligopoly",
            "facebook": "obolland",
            "instagram": "@jbcoleltd",
            "snapchat": "@olligopoly"
          }
        },
        {
          "img": "img/avatar.png",
          "name": "Janet",
          "contact": "You were so cute, text me sometime ;)",
          "time": "9:23 PM",
          "alert": false,
          "contacts": {
            "phone": "+447894563899",
            "skype": "@olligopoly",
            "facebook": "obolland",
            "instagram": "@jbcoleltd",
            "snapchat": "@olligopoly"
          }
        }
      ];
        //profile.pockets;
      $scope.isActive = function(person) {
        return person == $scope.activePerson;
      };
      $scope.activatePerson = function(person) {
        if($('.invisible .delete-button')) person == $scope.activePerson ? $scope.activePerson = undefined : $scope.activePerson = person;
      };
      $scope.personActivated = function(person) {
        if (person == $scope.activePerson) {
          return "contacts";
        }
        return "";
      };
      $scope.activatePoke = function(person) {
        if (person == $scope.activePerson) {
          $scope.activePerson = undefined;
        } else {
          $scope.activePerson = person;
        }
      };
      $scope.pokeActivated = function(person) {
        if (person == $scope.activePerson) {
          return "contacts";
        }
        return "";
      };
      $scope.pokeAlert = function(person) {
        if (person.timeToPoke < 5) {
          return "poke-alert";
        }

      $scope.toggleClass = function(){
          console.log('vad')
        }

      };
      $scope.pokeNow = function(person) {
        $state.go("poke");
      };
      $scope.contactAlert = function(person) {
        if (person.alert) {
          return "contact-alert";
        }

      };
      $scope.sendAlert = function($event, person, type) {
        $event.stopPropagation();
        if (!(type in person.details)) {
          return false;
        }
        if (type == "facebook") {
          window.open('https://www.facebook.com/' + person.details[type],'_blank');
        }
        if (type == "skype") {
          window.open('skype:' + person.details[type],'_blank');
        }
        if (type == "phone_number") {
          window.open('tel:' + person.details[type],'_blank');
        }
        if (type == "instagram") {
          window.open('https://www.instagram.com/' + person.details[type],'_blank');
        }
        if (type == "snapchat") {
          window.open('snapchat://?u=' + person.details[type],'_blank');
        }
        // alert(type, person);
        return false;
      };
      $scope.map = { };
      $scope.show = false;
      $scope.searchField = {
        name: ""
      };
      $scope.isValidDetail = function(dict, val) {
        try {
          if (val in dict.details) {
            return "";
          }
          return "disabled";
        } catch(err) {
          return "disabled";
        }
      };
      $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $("div.pocket-slides div.slide").each(function () {
          $(this).on('click', function () {
            var pockets = $('div.pocket-slides div.slide');
            if($(this)[0].clicked){
              $('div.pocket-icons').hide();
              pockets.each(function (pocket) {
                pockets[pocket].clicked = false;
              });
              $(this).find('div.pocket-icons:eq( 0 )').hide();
            } else {
              $('div.pocket-icons').hide();
              pockets.each(function (pocket) {
                pockets[pocket].clicked = false;
              });
              $(this).find('div.pocket-icons:eq( 0 )').show();
              $(this)[0].clicked = true;
            }
          });
        });
      });

      //uiGmapGoogleMapApi.then(function() {
      //
      //});

      $scope.dialNumber = function() {
        window.open('tel:' + this.elem.telephone, '_system');
      };

      $scope.location = function() {
        //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        //$scope.show = true;

      };
      $scope.isDeletedElem = {};
      $scope.delete = function(elem, index){
        $("#item" + index).css("height", $("#item" + index).height() + "px");
        $scope.isDeletedElem = elem;
        setTimeout(function() { $scope.images.splice($scope.images.indexOf(elem),1); $scope.setSortedImages(); }, 2000);
      };

      $scope.deletedElem = function(elem) {
        if (elem == $scope.isDeletedElem) {
          return "hiding";
        }
        return "";
      };

      //Sort user list by first letter of name
      $scope.setSortedImages = function() {
        var tmp={};
        for(i=0;i<$scope.images.length;i++) {
          var letter=$scope.images[i].name.toUpperCase().charAt(0);
          if( tmp[letter] ==undefined){
            tmp[letter]=[]
          }
          tmp[letter].push( $scope.images[i] );
        }
        $scope.sorted_images = tmp;
        //$scope.$apply();
      };
      $scope.setSortedImages();

      //Click letter event
      $scope.gotoList = function(id){
        $location.hash(id);
        $ionicScrollDelegate.anchorScroll();
      };
      //Create object with letters
      function iterateAlphabet() {
        var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers = [];
        for(var i=0; i<str.length; i++)
        {
          var nextChar = str.charAt(i);
          numbers.push(nextChar);
        }
        return numbers;
      }
      $scope.alphabet = iterateAlphabet();

      //Create groups by first letter of name
      $scope.groups = [];
      for (var i=0; i<10; i++) {
        $scope.groups[i] = {
          name: i,
          items: []
        };
        for (var j=0; j<3; j++) {
          $scope.groups[i].items.push(i + '-' + j);
        }
      }

      $scope.deletePoke = function(poke) {
        GmAPI.pokeDelete(poke.id)
          .then(function() {
            Profile.reload()
              .then(function(profile) {
                $scope.pokes = profile.pokes;
                $scope.pocket = profile.pockets;
              });
          })
      };
      $scope.deleteContact = function(contact) {
        GmAPI.contactDelete(contact.user_details.contactId)
          .then(function() {
            Profile.reload()
              .then(function(profile) {
                $scope.pokes = profile.pokes;
                $scope.pocket = profile.pockets;
              });
          })
      };

      $scope.gotScrolled = function() {
        $scope.$apply(function() {
          if($ionicScrollDelegate.getScrollPosition().top > 80) {
            $scope.top = 3;
          }
          else {
            $scope.top = 20;
          }
        });

      };
    });
}

angular.module('givmeApp.controllers')
  .controller('PocketCtrl',['$scope', '$rootScope', '$location', '$ionicScrollDelegate', '$state', 'GmAPI', 'Profile', 'gmAPIServerIP', /*'uiGmapGoogleMapApi',*/ PocketCtrl]);
