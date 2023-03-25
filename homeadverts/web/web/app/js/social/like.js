;(function (window, $) {
    'use strict';

    function Like (button) {
        this.button = button;
        this.actions = {
            addUrl: this.button.attr('data-add-url'),
            removeUrl: this.button.attr('data-remove-url'),
        };
        this.id = this.button.attr('data-id');
        this.title = this.button.attr('data-title');
        this.type = this.button.attr('data-type');

        this.propertyListItemClass = '.property-list-item';
        this.propertyGalleryContent = '[data-gallery-content]';

        this.isBusy = false;
        this.isLiked = this.button.hasClass('--is-liked');
        this.button.addClass('is-upgraded');

        this.init();
    }

    Like.prototype.init = function () {
        var _this = this;

        this.button.click(function () {
            if (window.user) {
                if (_this.isBusy === false) {
                    _this.isBusy = true;

                    if (!_this.isLiked) {
                        _this.add();
                    } else {
                        _this.remove();
                    }
                }
            } else {
                dispatchNewEvent('authNeeded');
            }
        });

        this.button.on('soft-toggle-liked', function () {
            if (!_this.isLiked) {
                _this.isLiked = true;
                _this.button.addClass('--is-liked');
            } else {
                _this.isLiked = false;
                _this.button.removeClass('--is-liked');
            }
        });
    };

    Like.prototype.updateCounter = function (value) {
        var containers = $('.' + this.type + '-likes-' + this.id);

        containers.map(function (i, item) {
            var container = $(item);
            var counter = container.find('span');
            var existingValue = parseInt(counter.text()) || 0;
            var newValue = existingValue + parseInt(value);

            counter.text(newValue);

            if (newValue) {
                container.removeClass('--hidden');
            } else {
                container.addClass('--hidden');
            }
        });
    };

    Like.prototype.add = function () {
        var _this = this;

        $.ajax({
            url: this.actions.addUrl,
            method: 'POST',
            contentType: 'application/json',
            success: function (res, status, xhr) {
                if (xhr.status == 200) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: 'You liked ' + _this.title,
                    });

                    _this.isBusy = false;
                    _this.isLiked = true;
                    _this.button.addClass('--is-liked');
                    _this.updateCounter(+1);
                    _this.updateGalleryLiked();
                }
            },
            error: function () {
                _this.isBusy = false;
            },
        });
    };

    Like.prototype.remove = function () {
        var _this = this;

        $.ajax({
            url: this.actions.removeUrl,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (res, status, xhr) {
                if (xhr.status == 200) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: 'Your like of ' + _this.title + ' removed',
                    });

                    _this.isBusy = false;
                    _this.isLiked = false;
                    _this.button.removeClass('--is-liked');
                    _this.updateCounter(-1);
                    _this.updateGalleryLiked();
                }
            },
            error: function () {
                _this.isBusy = false;
            },
        });
    };

    Like.prototype.updateGalleryLiked = function () {
        var galleryContent = this.button
            .closest(this.propertyListItemClass)
            .find(this.propertyGalleryContent);

        if (!galleryContent.length) {
            return;
        }

        if (this.isLiked) {
            galleryContent.html(
                galleryContent.html().replace(/data-liked=../, 'data-liked="1"')
            );
        } else {
            galleryContent.html(
                galleryContent.html().replace(/data-liked=.1./, 'data-liked=""')
            );
        }
    };

    var boot = function () {
        var buttons = $('.like:not(.is-upgraded)');
        var articleLikeButtons = $('.like-button');

        buttons.map(function (i, button) {
            new Like($(button));
        });
        articleLikeButtons.map(function (i, button) {
            new Like($(button));
        });
    };

    $(document).ready(function () {
        boot();
    });

    window.addEventListener('paginationUpdated', boot, false);

})(window, jQuery);
