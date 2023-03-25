;(function (window, $) {
    'use strict';

    function PropertyVideo3d(wrapper) {
        this.wrapper = $('.video-3d-wrapper');

        if (!this.wrapper.length) {
            return;
        }

        this.closeButton = this.wrapper.find('.video-3d-close');
        this.poweredByLink = $('.powered-by');

        this.iframe = this.wrapper.find('#property-video-3d');

        this.bindEvents();
    }

    PropertyVideo3d.prototype.bindEvents = function () {
        var _this = this;

        $(document).on('video-events-update', function () {
            $('.play-3d').on(window.pointerEventType, function (e) {
                var url = $(this).attr("data-url");

                if (_this.url !== url) {
                    _this.setSource(url);
                }
                _this.open();

                e.stopPropagation();
                e.preventDefault();
            });
        });

        $(window).bind('keyup', function(e) {
            if (_this.url && (e.which == 27)) {
                _this.close();
            }
        });

        this.closeButton.on(window.pointerEventType, function (e) {
            e.stopPropagation();
            e.preventDefault();

            _this.close();
        });
    };

    PropertyVideo3d.prototype.setSource = function (url) {
        var autoplay = '&play=1';
        this.url = url;
        this.iframe.attr('src', url + autoplay);
    };

    PropertyVideo3d.prototype.open = function (url) {
        this.wrapper.addClass('--open');
    };

    PropertyVideo3d.prototype.close = function (url) {
        this.wrapper.removeClass('--open');
    };

    $(document).ready(function () {
        new PropertyVideo3d('.video-3d-wrapper');

        $(document).trigger('video-events-update');
    });


})(window, jQuery);
