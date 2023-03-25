;(function (window, $) {
    "use strict";

    function Featured(button) {
        this.button = $(button);

        if (!button.length) {
            return;
        }

        this.actions = {
            addUrl: this.button.attr('data-add-url'),
            removeUrl: this.button.attr('data-remove-url')
        };
        this.isSelected = this.button.hasClass('checked');
        this.button.addClass('is-featured-upgraded');

        this.init();
    }

    Featured.prototype.init = function () {
        var _this = this;

        if (window.user) {
            this.button.click(function (e) {
                if (!_this.isSelected) {
                    _this.add();
                } else {
                    _this.remove();
                }
            });
        }
    };

    Featured.prototype.add = function () {
        var _this = this;

        $.ajax({
            url: this.actions.addUrl,
            method: "POST",
            contentType: "application/json",
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Added to featured"
                });

                _this.isSelected = true;
                _this.button.addClass('checked');
            }
        });
    };

    Featured.prototype.remove = function () {
        var _this = this;

        $.ajax({
            url: this.actions.removeUrl,
            method: "DELETE",
            contentType: "application/json",
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Removed from featured"
                });

                _this.isSelected = false;
                _this.button.removeClass('checked');
            }
        });
    };

    var boot = function () {
        var buttons = $('.edit-actions .action-featured:not(is-featured-upgraded)');

        if (buttons.length) {
            buttons.map(function (i, button) {
                new Featured($(button));
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
