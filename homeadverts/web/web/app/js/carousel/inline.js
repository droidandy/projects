;(function (window, $) {
    'use strict';

    /**
     * Constructor
     */
    function InlineCarousel(container, initialIndex) {
        Carousel.call(
            this,
            container,
            initialIndex,
            'inline'
        );

        this.initialize();
        this.bindInlineEvents();
        this.fixScrollJump();
        this.resizeFlickity();
    }

    InlineCarousel.prototype = Object.create(Carousel.prototype);
    InlineCarousel.prototype.constructor = InlineCarousel;

    /**
     * Bind inline specific events
     *
     * @return {void}
     */
    InlineCarousel.prototype.bindInlineEvents = function () {
        $('.gallery-cell img')
            .first()
            .on('load', $.proxy(this, 'resizeFlickity'));
    };

    /**
     * resizeCell
     */
    InlineCarousel.prototype.resizeFlickity = function () {
        var img = $('.gallery-cell img');
        var cell = this.carousel.find('.gallery-cell');

        img.removeClass('--mobile-height');

        if ($(window).width() < window.mobileScreenWidth) {
            img.addClass('--mobile-height');

            this.carousel.css('height', img.height());
            cell.css('height', img.height());
        } else {
            this.carousel.css('height', '');
            cell.css('height', '');
        }

        this.carousel.flickity('resize');
    };

    /**
     * Apply a monkey patch in order to fix a scroll jump on first click
     *
     * @return {void}
     */
    InlineCarousel.prototype.fixScrollJump = function () {
        this.carousel.data('flickity').pointerDownFocus = function(event) {
            var touchStartEvents = {
                touchstart: true,
                MSPointerDown: true
            };

            var focusNodes = {
                INPUT: true,
                SELECT: true
            };

            if (!this.options.accessibility ||
                touchStartEvents[event.type] ||
                focusNodes[event.target.nodeName]) {
                return;
            }

            var prevScrollTop = $(window).scrollTop();
            this.element.focus();
            if ($(window).scrollTop() !== prevScrollTop) {
                $(window).scrollTop(prevScrollTop);
            }
        };
    };

    window.InlineCarousel = InlineCarousel;

})(window, jQuery);

;(function (window, $) {
    $(document).ready(function () {
        var carouselTag = '.inline-carousel';

        if ($(carouselTag).length) {
            $('.inline-carousel').removeClass('--raw');
            new InlineCarousel(carouselTag, 0);
        }
    });
})(window, jQuery);
