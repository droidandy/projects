;(function (window, $) {
    'use strict';

    /**
     * Constructor. See: http://flickity.metafizzy.co/
     *
     * @param {DOM|jQuery} container - top element of this carousel
     * @param {Number} initialIndex - index of the first photo displayed
     * @param {String} type
     * @return {void}
     */
    function Carousel(container, initialIndex, type) {
        this.container = $(container);
        this.initialIndex = initialIndex - 1;
        this.type = type;

        this.settings = {
            cellAlign: 'center',
            initialIndex: Math.max( this.initialIndex, 0 ),
            draggable: true,
            accessibility: true,
            setGallerySize: false,
            wrapAround: true,
            lazyLoad: window.galleryLazyload,
            pageDots: false,
            contain: true,
            selectedAttraction: window.isMobile ? 0.06 : 1,
            friction: window.isMobile ? 0.6 : 1
        };

        this.active = false;
        this.body = $('body');

        this.carousel = null;
        this.counter = null;
    }

    /**
     * Initialize carousel and bind events
     *
     * @return {void}
     */
    Carousel.prototype.initialize = function () {
        this.initCarousel();
        this.bindEvents();
    };

    /**
     * Initialize flickity and carousel counter
     *
     * @return {void}
     */
    Carousel.prototype.initCarousel = function () {
        this.carousel = this.container
            .find('.carousel')
            .flickity(this.settings);

        this.counter = new CarouselCounter(this.carousel, this.type);
        this.active = true;
    };

    /**
     * Bind common events
     *
     * @return {void}
     */
    Carousel.prototype.bindEvents = function () {
        this.carousel
            .on('touchstart', $.proxy(this, 'onTouchStart'))
            .on('dragStart.flickity', $.proxy(this, 'onDragStart'))
            .on('mouseup touchend', $.proxy(this, 'onTouchEnd'))
            .on('staticClick.flickity', $.proxy(this, 'photoClick'));

        this.container
            .find('.gallery-toolbar li')
            .on('click', $.proxy(this, 'toolbarButtonClick'));

        $(window)
            .on('resize', $.proxy(this, 'resizeFlickity'));
    };

    /**
     * Keep scroll value
     *
     * @return {void}
     */
    Carousel.prototype.onTouchStart = function () {
        this.scrollBeforeClick = $(window).scrollTop();
    };

    /*
     * Prevent viewport from scrolling while dragging the carousel
     *
     * @return {void}
     */
    Carousel.prototype.onDragStart = function () {
        this.disableBounce();
    };

    /*
     * Resume scrolling
     *
     * @return {void}
     */
    Carousel.prototype.onTouchEnd = function (event) {
        this.enableBounce();
        this.afterTouchEndEvent = event;
        setTimeout($.proxy(this, 'afterTouchEnd'), 100);
    };

    /*
     * Prevent flickity from getting stuck if pointerUp didn't fire properly
     *
     * @return {void}
     */
    Carousel.prototype.afterTouchEnd = function () {
        if ( $('.flickity-viewport').hasClass('is-pointer-down') ) {
            this.carousel.flickity('pointerUp', this.afterTouchEndEvent);
            this.carousel.flickity('ontouchend', this.afterTouchEndEvent);
        }
        this.afterTouchEndEvent = null;
    };

    /**
     * Select next photo when clicked on a photo
     *
     * @param {Object} event - flickity event
     * @return {void}
     */
    Carousel.prototype.photoClick = function (event) {
        if (!this.active) {
            return;
        }

        var target = $(event.originalEvent.target),
            toolbarButton = target.closest('.gallery-toolbar li'),
            cell = target.closest('.gallery-cell'),
            actions = target.closest('.article-actions'),
            currentScroll = $(window).scrollTop(),
            scrollBefore = this.scrollBeforeClick,
            scrolling = scrollBefore >= 0 && scrollBefore !== currentScroll,
            index;

        if (toolbarButton.length || actions.length || scrolling) {
            return;
        } else if (cell.length) {
            index = cell.find('img').data('index');
            this.navigate(index);
        }
    };

    /**
     * Counter button click selects the first photo
     * Like button click updates liked status
     *
     * @param {Object} event
     * @return {void}
     */
    Carousel.prototype.toolbarButtonClick = function (event) {
        var target = $(event.target);

        if (target.closest('.counter-wrapper').length) {
            this.carousel.flickity('select', 0, true);
        } else if (target.closest('.like').length) {
            this.toggleLiked();
        }
    };

    /**
     * Handle like action
     *
     * @return {void}
     */
    Carousel.prototype.toggleLiked = function () {
        var liked = this.container.attr('data-liked');

        if (liked === undefined) {
            return;
        }

        if (liked === '1') {
            this.unsetLiked();
        } else {
            this.setLiked();
        }
    };

    /**
     * Add liked status
     *
     * @return {void}
     */
    Carousel.prototype.setLiked = function () {
        this.container.attr('data-liked', 1);
    };

    /**
     * Remove liked status
     *
     * @return {void}
     */
    Carousel.prototype.unsetLiked = function () {
        this.container.attr('data-liked', 0);
    };

    /**
     * Trigger flickity resize method
     *
     * @return {void}
     */
    Carousel.prototype.resizeFlickity = function () {
        this.carousel.flickity('resize');
    };

    Carousel.prototype.disableBounce = function () {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };
    };

    Carousel.prototype.enableBounce = function () {
        document.ontouchmove = function () {
            return true;
        };
    };

    /**
     * Check if given index is the last one
     *
     * @param {Number} index
     * @return {Boolean}
     */
    Carousel.prototype.isLastIndex = function (index) {
        var total = this.carousel.data('flickity').cells.length - 1;

        return index == total;
    };

    /**
     * Get selected index
     *
     * @return {Number}
     */
    Carousel.prototype.getSelectedIndex = function () {
        return this.carousel.data('flickity').selectedIndex;
    };

    /**
     * Navigate to next/prev slide, depends on its index.
     *
     * @param {Number} index
     * @return {void}
     */
    Carousel.prototype.navigate = function (index) {
        // Last & Left
        if ((this.getSelectedIndex() == 0) && this.isLastIndex(index)) {
            return this.carousel.flickity('previous', true);
        }

        // Last & Right
        if ((index == 0) && (this.isLastIndex(this.getSelectedIndex()))) {
            return this.carousel.flickity('next', true);
        }

        // Left
        if (index < this.getSelectedIndex()) {
            return this.carousel.flickity('previous', true);
        }

        // Middle & right
        if (index >= this.getSelectedIndex()) {
            return this.carousel.flickity('next', true);
        }
    };

    window.Carousel = Carousel;

})(window, jQuery);

Flickity.prototype.positionSlider = function () {
    var x = this.x,
        width = this.slideableWidth,
        value = 0;

    if (this.cells.length > 1) {
        x = ((x % width) + width) % width;
        x = x - this.slideableWidth;
        this.shiftWrapCells(x);
    }

    x = x + this.cursorPosition;
    if (this.options.rightToLeft) {
        x = -x;
    }

    value = this.getPositionValue(x);
    this.slider.style.transform = 'translate3d(' + value + ',0,0)';
};
