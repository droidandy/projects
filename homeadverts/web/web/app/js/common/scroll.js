;(function (window, $) {
    'use strict';

    function Scroll() {
        this.scrollingElements = [
            '#sidenav',
            '.search-wrapper',
            'dialog',
            '.help-sidebar ul',
            '#sidebar-filters > form',
            '#sidebar-filters .mp-level',
        ].join(',');

        this.nonScrollingElements = '.mdl-layout__obfuscator';

        this.bindEvents();
        this.lateBindEvents();
    }

    Scroll.prototype.bindEvents = function () {
        $(this.scrollingElements).each(function (i, element) {
            element.addEventListener('touchstart', function (e) {
                var pageY = e.pageY || e.touches[0].pageY;
                this.allowUp = this.scrollTop > 0;
                this.allowDown = this.scrollTop < this.scrollHeight - this.clientHeight;
                this.slideBeginY = pageY;
            });

            element.addEventListener('touchmove', function (e) {
                var pageY = e.pageY || e.touches[0].pageY,
                    up = pageY > this.slideBeginY,
                    down = pageY < this.slideBeginY;
                this.slideBeginY = pageY;

                if ((up && this.allowUp) || (down && this.allowDown)) {
                    e.stopPropagation();
                } else {
                    e.preventDefault();
                }
            });
        });
    };

    Scroll.prototype.lateBindEvents = function () {
        var _this = this;

        $(window).on('load', function () {
            $(_this.nonScrollingElements).each(function (i, element) {
                element.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                });
            });
        });
    };

    Scroll.updateLock = function () {
        setTimeout(function () {
            var lock =
                $('.nav-header').hasClass('--show-search') ||
                $('dialog').hasClass('--shown') ||
                $('#sidenav').hasClass('is-visible') ||
                $('.modal-carousel').length ||
                ( $('.switch-views').length && !$('.switch-views').hasClass('--collection') );

            if (lock) {
                $('body').addClass('--no-scroll');
            } else {
                $('body').removeClass('--no-scroll');
            }
        }, 0);
    };

    $(document).ready(function () {
        new Scroll();
    });

    window.Scroll = Scroll;

})(window, jQuery);
