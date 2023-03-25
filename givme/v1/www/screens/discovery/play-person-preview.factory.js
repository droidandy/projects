'use strict';

function PlayPersonPreview() {

  return function(person) {

    person.photos.forEach(function(photo) {
      photo.active = false;
    });

    person.photos[0].active = true;

    return {
      name: person.name,
      age: person.age,
      antagonist: person.antagonist,
      showInfo: false,
      showIceBreakers: true,
      showLanguages: false,
      animateChange: false,
      rejected: false,
      accepted: false,
      left: '0px',
      photos: person.photos,
      languages: person.languages,
      iceBreakers: person.iceBreakers,
      onAccept: person.onAccept,
      onReject: person.onReject,
      prevPhoto: "",
      currentPhoto: "",
      domId: person.domId,
      /**
       * Set antagonist for person
       * @param person
       */
      setAntagonist: function(person) {
        this.antagonist = person;
      },
      /**
       * Show information container
       */
      showInformation: function() {
        if(!this.accepted && !this.rejected) {
          //  Move big image to initial position
          if(this.left != '0') {
            this.left = '0';
          }
          this.showInfo = true;
        }
        $("#" +  this.domId).find(".slide-flip-block").flip('toggle');
      },
      /**
       * Switch information container to ice breakers view
       */
      switchToIceBreakers: function() {
        if(this.showInfo) {
          this.showIceBreakers = true;
          this.showLanguages = false;
        }
      },
      /**
       * Switch information container to languages view
       */
      switchToLanguages: function() {
        if(this.showInfo) {
          this.showIceBreakers = false;
          this.showLanguages = true;
        }
      },
      /**
       * Returns url of big selected photo
       * @returns {string}
       */
      selectedPhoto: function() {
        return this.photos.filter(function(photo) {
          return photo.active;
        })[0].full;
      },
      /**
       * Set photo to active state and show it in full size.
       * Hide person details (ice breakers and languages).
       * Move big image to initial position and hide accept/reject buttons
       * @param photo
       */
      selectPhoto: function(photo) {
        this.showInfo = false;
        this.showIceBreakers = true;
        this.showLanguages = false;
        this.left = '0';
        if(photo.full !== this.selectedPhoto()) {
          this.prevPhoto = this.selectedPhoto();
          this.animateChange = true;
          $("#" + this.domId).find(".prev-photo").addClass("visible");
        }
        //  Reset all photos to inactive state
        this.photos.forEach(function(photo) {
          photo.active = false;
        });
        //  Set selected photo to active state
        photo.active = true;
        this.currentPhoto = this.selectedPhoto();
        var me = this;
        setTimeout(function() { $("#" + me.domId).find(".slide-flip-block").flip(false); $("#" + me.domId).find(".prev-photo").removeClass("visible"); }, 200);
      },
      /**
       * Function will propose to reject or to accept person depending on gesture direction and velocity
       * @param event
       */
      propose: function(event) {
        if(this.accepted || this.rejected) {
          return;
        }
        if(event.gesture.velocityX > 1.8) {
          this.left = '0';
          if(event.gesture.deltaX > 0) {
            this.accept();
          } else {
            this.reject();
          }
          return;
        }
        if(event.gesture.deltaX > 0) {
          //  Accept state
          this.left = '70px';
        } else {
          //  Reject state
          this.left = '-70px';
        }
      },
      /**
       * Function will accept person
       */
      accept: function() {
        if(this.accepted || this.rejected) {
          return;
        }
        this.left = '0';
        this.showInfo = false;
        this.showIceBreakers = false;
        this.showLanguages = false;
        this.accepted = true;
        this.rejected = false;
        if(this.onAccept) {
          this.onAccept();
        }
      },
      /**
       * Function will reject person
       */
      reject: function() {
        if(this.rejected || this.accepted) {
          return;
        }
        this.left = '0';
        this.showInfo = false;
        this.showIceBreakers = false;
        this.showLanguages = false;
        this.accepted = false;
        this.rejected = true;
        if(this.onReject) {
          this.onReject();
        }
      }
    };
  };
}

angular.module('givmeApp.services')
  .factory('PlayPersonPreview', [PlayPersonPreview]);