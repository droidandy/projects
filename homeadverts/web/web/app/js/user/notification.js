;(function (window, $) {
    'use strict';

    function Notification(className) {
        this.notifification = $(className);

        if (!this.notifification.length) {
            return;
        }

        this.url = this.notifification.attr('data-url');
        this.balloon = $('.notification-balloon');
        this.timestamp = this.notifification.attr('data-date');
        this.total = this.notifification.attr('data-total');

        this.init();
    }

    Notification.prototype.init = function () {
        var _this = this;

        this.notifification.click(function () {
            if (_this.balloon.hasClass('--unread')) {
                _this.readAll();
            }
        });
    };

    Notification.prototype.readAll = function () {
        var _this = this;

        if (this.total) {
            $.ajax({
                url: this.url,
                dataType: "json",
                method: "POST",
                data: JSON.stringify({
                    timestamp: this.timestamp
                }),
                contentType: "application/json",
                success: function (res, status, xhr) {
                    _this.balloon.removeClass('--unread');
                    _this.balloon.find('.counter').text(0);
                    _this.notifification.find('.counter').text(0);
                    _this.notifification.removeClass('--unread');
                }
            });
        }

    };

    $(document).ready(function () {
        new Notification('.notifications');
    });

})(window, jQuery);
