;(function (window, $) {
    "use strict";

    function PrimaryPhoto(button) {
        this.button = $(button);

        if (!button.length) {
            return;
        }

        this.url = this.button.attr('data-set-url');
        this.isSelected = this.button.hasClass('checked');
        this.button.addClass('is-primary-upgraded');

        this.init();
    }

    PrimaryPhoto.prototype.init = function () {
        var _this = this;

        if (window.user) {
            this.button.click(function (e) {
                _this.set();
            });
        }
    };

    PrimaryPhoto.prototype.set = function () {
        var _this = this;

        var payload = {
            'photoHash': this.button.attr('data-photo-hash'),
            'propertyId': this.button.attr('data-property-id')
        };

        $.ajax({
            method: "POST",
            url: this.url,
            data: JSON.stringify(payload),
            contentType: "application/json",
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Selected as primary"
                });

                _this.button.closest('.gallery-wrapper').removeClass('checked');

                _this.isSelected = true;
                _this.button.addClass('checked');
            }
        });
    };

    var boot = function () {
        var actions = $('.action-primary-photo:not(.is-primary-upgraded)');

        if (actions.length) {
            actions.map(function (i, a) {
                new PrimaryPhoto($(a));
            });
        }
    };

    $(document).ready(function () {
        boot();
    });
    window.addEventListener('paginationUpdated', function () {
        boot();
    }, false);

})(window, jQuery);
