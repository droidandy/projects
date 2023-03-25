;(function (window, $) {
    'use strict';

    /**
     * Constructor
     * http://flickity.metafizzy.co/
     */
    function Slider(container, initialIndex) {
        this.initialIndex = initialIndex;
        this.container = container;
        this.open();
        this.resize();
    }

    /**
     * resizeCell
     */
    Slider.prototype.resizeCell = function () {
        var img = $('.gallery-cell img');
        var cell = this.carousel.find('.gallery-cell');

        if ($(window).width() > window.mobileScreenWidth) {
            var galleryWide = $('.property-gallery-wide').outerWidth() - $('.profile-block').outerWidth() - 10;

            cell.css('height', '');
            this.carousel.css('width', galleryWide);
            this.carousel.css('height', '');
        } else {
            this.carousel.css('height', '');

            img.css('height', 'auto');
            img.css('width', '100%');
            img.addClass('--mobile-height');

            cell.css('height', (img.height()));
            this.carousel.css('width', '100%');
            this.carousel.css('height', (img.height()));
        }

        this.carousel.flickity('resize');
    };

    /**
     * resize
     */
    Slider.prototype.resize = function () {
        $(window).resize($.proxy(function (e) {
            this.resizeCell();
        }, this));
        $(window).bind("load", $.proxy(function (e) {
            this.resizeCell();
        }, this));
    };

    /**
     * open
     */
    Slider.prototype.open = function () {
        var attraction = 1;
        var friction = 1;
        if (window.isMobile) {
            attraction = 0.3;
            friction = 0.9;
        }

        this.carousel = $(this.container).flickity({
            cellAlign: 'center',
            initialIndex: this.initialIndex,
            draggable: window.isMobile,
            accessibility: true,
            setGallerySize: false,
            wrapAround: true,
            lazyLoad: window.sliderLazyload,
            pageDots: false,
            contain: true,
            selectedAttraction: attraction,
            friction: friction
        });

        this.carousel.on('click', $.proxy(function (event) {
            if (window.isMobile == false) {
                var target = $(event.target);
                if (target.hasClass('gallery-cell') || target.hasClass('gallery-cell-image')) {
                    this.carousel.flickity('next', true);
                }
            }
        }, this));

        this.resizeCell()
    };

    window.Slider = Slider;
})(window, jQuery);

;(function (window, $) {
    $(document).ready(function () {
        var sliderTag = '.slider .carousel';

        if ($(sliderTag).length) {
            var initialIndex = $(sliderTag).attr('data-index');

            new Slider(sliderTag, initialIndex);
        }
    });
})(window, jQuery);
