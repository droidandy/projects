;(function (window, $) {
    'use strict';

    function UserProfile(className) {
        this.profile = $(className);

        if (!this.profile.length) {
            return;
        }

        // Bio
        this.profileBio = this.profile.find('.details');
        this.profileBioForm = this.profileBio.find('form');

        this.bio = this.profileBio.find('.about');
        this.bioInput = this.bio.find('.data-input');
        this.bioValue = this.bioInput.val();
        this.bioShowMoreButton = this.bio.find('.trigger');
        this.bioEmptyLabel = this.bio.find('.empty');

        this.name = this.profileBio.find('.username');
        this.nameInput = this.name.find('.data-input');
        this.nameValue = this.nameInput.val();

        // Profile image
        new ImageCropper({
            title: 'profile',
            element: '.user-profile-upload',
            images: '.profile-block-image',
            dialog: '.image-cropping-dialog',
            cropper: {
                aspectRatio: 1,
                viewMode: 1
            }
        });

        // Background image
        new ImageCropper({
            title: 'background',
            element: '.user-background-upload',
            handle: '.background .upload-image',
            dialog: '.background-cropping-dialog',
            cropper: {
                aspectRatio: 6,
                viewMode: 3,
                dragMode: 'move',
                autoCropArea: 1,
                scalable: false,
                zoomable: false,
                cropBoxResizable: false,
                toggleDragModeOnDblclick: false
            }
        });

        this.bindBioEvents();
    }

    UserProfile.prototype.bindBioEvents = function () {
        var _this = this;

        this.name.on('click', function () {
            _this.name.addClass('--edit');
            _this.nameInput.attr("readonly", false);
            _this.nameInput.focus();
        });

        this.bio.on('click', function () {
            _this.bio.addClass('--edit');
            _this.bio.removeClass('--folded');
            _this.bioInput.attr("readonly", false);
            _this.bioInput.focus();
        });

        this.bioShowMoreButton.on('click', function () {
            _this.bio.toggleClass('--folded');
        });

        this.bioEmptyLabel.on('click', function () {
            _this.bio.removeClass('--empty');
        });

        $('body').on('click', function (e) {
            if ($(e.target).parent('.edit-field').hasClass('--edit')) {
                return;
            }
            _this.saveBio();
        });
    };

    UserProfile.prototype.saveBio = function () {
        var _this = this;

        this.bio.removeClass('--edit');
        this.bio.addClass('--folded');
        this.name.removeClass('--edit');
        this.bioInput.attr("readonly", true);
        this.nameInput.attr("readonly", true);

        if (!this.bioInput.val()) {
            this.bio.addClass('--empty');
        }

        if ((this.bioValue == this.bioInput.val()) && (this.nameValue == this.nameInput.val())) {
            return;
        }

        $.ajax({
            url: this.profileBioForm.attr('action'),
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "name": this.nameInput.val(),
                "bio": this.bioInput.val()
            }),
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Profile updated."
                });

                _this.bioValue = _this.bioInput.val();
                _this.nameValue = _this.nameInput.val();
            }
        });
    };

    $(document).ready(function () {
        new UserProfile('.user-info.--edit-profile')
    });

})(window, jQuery);
