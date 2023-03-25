;(function (window, $) {
    "use strict";

    function PropertyStoryConverter(button) {
        this.button = $(button);

        if (!button.length) {
            return;
        }

        this.url = this.button.attr('data-url');

        this.init();
    }

    PropertyStoryConverter.prototype.init = function () {
        var _this = this;

        if (window.user) {
            this.button.click(function (e) {
                _this.convert();
            });
        }
    };

    PropertyStoryConverter.prototype.convert = function () {
        dispatchNewEvent('showLoadingScreen');

        $.ajax({
            url: this.url,
            method: "POST",
            contentType: "application/json",
            success: function (res, status, xhr) {
                dispatchNewEvent('hideLoadingScreen');

                window.location.href = xhr.getResponseHeader('Location')+'?with-help=1';
            },
            error: function (xhr, status, errorThrown) {
                dispatchNewEvent('hideLoadingScreen');
            }
        });
    };

    var boot = function () {
        var buttons = $('.edit-actions .action-convert-story');

        if (buttons.length) {
            buttons.map(function (i, button) {
                new PropertyStoryConverter($(button));
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
