;(function (window, $) {
    "use strict";

    function Covers(className) {
        this.className = className;

        this.duration = 750;
        this.timeout = 7000;

        this.bindEvents();
    }

    Covers.prototype.bindEvents = function () {
        $('body').on('click', '.nav-dot', $.proxy(this, 'setImage'));
        $(window).on('load', $.proxy(this, 'resetInterval'));
    };

    Covers.prototype.resetInterval = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval($.proxy(this, 'next'), this.timeout);
    };

    Covers.prototype.next = function () {
        var _this = this;

        $(this.className).each(function (i, container) {
            _this.nextImage($(container));
            _this.nextDot($(container));
        });
    };

    Covers.prototype.nextImage = function (container, next) {
        var _this = this,
            images = container.find('.cover-slide'),
            current = images.filter('.--active');

        if (images.length === 1) {
            return false;
        }

        next = next || current.next();
        if (!next.hasClass('cover-slide')) {
            next = images.first();
        }

        current.removeClass('--active');
        current.addClass('--animate-out');

        next.addClass('--active');
        next.addClass('--animate-in');

        this.animating = true;

        setTimeout(function () {
            current.removeClass('--animate-out');
            next.removeClass('--animate-in');
            _this.animating = false;
        }, this.duration);
    };

    Covers.prototype.nextDot = function (container, next) {
        var dots = container.find('.nav-dot'),
            current = dots.filter('.--active');

        next = next || current.next();
        if (!next.hasClass('nav-dot')) {
            next = dots.first();
        }

        current.removeClass('--active');
        next.addClass('--active');
    };

    Covers.prototype.setImage = function (e) {
        e.preventDefault();

        if (this.animating) {
            return;
        }

        var dot = $(e.target),
            container = dot.closest(this.className),
            index = dot.index(),
            image = $(container.find('.cover-slide')[index]);

        if (dot.hasClass('--active')) {
            return;
        }

        this.nextImage(container, image);
        this.nextDot(container, dot);
        this.resetInterval();
    };

    $(document).ready(function () {
        new Covers('.covers');
    });

})(window, jQuery);
