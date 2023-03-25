;(function (window, $) {
    'use strict';

    /**
     * Constructor
     */
    function ModalCarousel(container, initialIndex) {
        this.parent = $(container);

        Carousel.call(
            this,
            this.getHtml(),
            initialIndex,
            'modal'
        );

        this.swipeUpCloseThreshold = 45;
        this.galleryWrapper = this.container.find('.gallery-wrapper');

        this.initialize();
        this.bindModalEvents();

        dispatchNewEvent(document, 'video-events-update');
        dispatchNewEvent('paginationUpdated');
    
        // For actions on property details, if dd button doesn't work/
        componentHandler.upgradeDom();
    }

    ModalCarousel.prototype = Object.create(Carousel.prototype);
    ModalCarousel.prototype.constructor = ModalCarousel;

    /**
     * Create carousel markup before initializing flickity
     *
     * @return {void}
     */
    ModalCarousel.prototype.initialize = function () {
        this.container
            .appendTo(this.body)
            .css({ opacity: 0 })
            .velocity({ opacity: 1 }, 250);

        Carousel.prototype.initialize.call(this);
        Scroll.updateLock();
    };

    /**
     * Bind modal specific events
     *
     * @return {void}
     */
    ModalCarousel.prototype.bindModalEvents = function () {
        this.container
            .on('click', $.proxy(this, 'onOutsideClick'))
            .on('mousedown touchstart', $.proxy(this, 'onInteractionStart'))
            .on('mousemove touchmove', $.proxy(this, 'onInteractionMove'))
            .on('mouseup touchend', $.proxy(this, 'onInteractionEnd'));

        this.carousel
            .on('cellSelect.flickity', $.proxy(this, 'onChange'));

        this.body
            .on('keydown', $.proxy(this, 'onKeydown'));
    };

    /**
     * Close this modal when clicked outside a photo
     *
     * @param {Object} event
     * @return {void}
     */
    ModalCarousel.prototype.onOutsideClick = function (event) {
        if (!this.active) {
            return;
        }

        var target = $(event.target),
            toolbarButton = target.closest('.gallery-toolbar li'),
            cell = target.closest('.gallery-cell');

        if (toolbarButton.length === 0 && cell.length === 0) {
            this.close();
        }
    };

    /**
     * Remember touch start position
     *
     * @param {Object} event
     * @return {void}
     */
    ModalCarousel.prototype.onInteractionStart = function (event) {
        if (event.type.indexOf('mouse') === 0 &&
            event.which !== 1) {
            return;
        }

        this.startX = this.getPosition(event, 'x');
        this.startY = this.getPosition(event, 'y');
    };

    /**
     * Show swipe up animation if threshold was exceeded
     *
     * @param {Object} event
     * @return {void}
     */
    ModalCarousel.prototype.onInteractionMove = function (event) {
        if (event.type.indexOf('mouse') === 0 &&
            event.which !== 1) {
            return;
        }

        event.preventDefault();

        this.currentX = this.getPosition(event, 'x');
        this.currentY = this.getPosition(event, 'y');

        if (this.startY === undefined ||
            this.currentY === undefined) {
            return;
        }

        var diffX = this.startX - this.currentX,
            diffY = this.startY - this.currentY;

        if (Math.abs(diffY) > Math.abs(diffX) &&
            diffY > this.swipeUpCloseThreshold) {
            this.galleryWrapper
                .velocity('stop', true)
                .velocity({
                    translateY: -diffY + this.swipeUpCloseThreshold,
                    opacity: this.currentY / this.startY
                }, 0);
        } else {
            this.galleryWrapper
                .velocity('stop', true)
                .css({
                    transform: '',
                    opacity: ''
                });
        }
    };

    /**
     * Hide this modal on swipe up
     *
     * @return {void}
     */
    ModalCarousel.prototype.onInteractionEnd = function () {
        if (event.type.indexOf('mouse') === 0 &&
            event.which !== 1) {
            return;
        }

        if (this.startY === undefined ||
            this.currentY === undefined) {
            return;
        }

        var diffX = this.startX - this.currentX,
            diffY = this.startY - this.currentY;

        if (Math.abs(diffY) > Math.abs(diffX) &&
            diffY > this.swipeUpCloseThreshold) {
            this.galleryWrapper
                .velocity('stop', true)
                .velocity({
                    translateY: -diffY - 300 + this.swipeUpCloseThreshold,
                    opacity: 0
                }, 300);
            this.close();
        } else {
            this.galleryWrapper
                .velocity('stop', true)
                .css({
                    transform: '',
                    opacity: ''
                });
        }

        this.startX = this.currentX = undefined;
        this.startY = this.currentY = undefined;
    };

    /**
     * Get touch's position on a given axis
     *
     * @param {Object} event
     * @param {String} axis - either 'x' or 'y'
     * @return {Number|undefined}
     */
    ModalCarousel.prototype.getPosition = function (event, axis) {
        var property = 'page' + axis.toUpperCase();

        if (event.type.indexOf('touch') === 0) {
          if (event.originalEvent.touches.length > 0) {
              return event.originalEvent.touches[0][property];
          } else {
              return undefined;
          }
        } else if (event.type.indexOf('mouse') === 0) {
          return event[property];
        }
    };

    /**
     * Update dynamic counter
     *
     * @return {void}
     */
    ModalCarousel.prototype.onChange = function () {
        this.counter.update();
    };

    /**
     * Close this modal on ESC keypress
     *
     * @param {Object} event
     * @return {void}
     */
    ModalCarousel.prototype.onKeydown = function (event) {
        event.stopPropagation();

        if (event.keyCode === 27) {
            this.close();
        }
    };

    /**
     * Set liked status to parent element's like button and update this carousel's template
     *
     * @return {void}
     */
    ModalCarousel.prototype.setLiked = function () {
        var content = this.parent.find('[data-gallery-content]');

        this.container.attr('data-liked', 1);
        this.parent.find('.like').trigger('soft-toggle-liked');

        content.html(content.html().replace(/data-liked=../, 'data-liked="1"'));
    };

    /**
     * Remove liked status from parent element's like button and update this carousel's template
     *
     * @return {void}
     */
    ModalCarousel.prototype.unsetLiked = function () {
        var content = this.parent.find('[data-gallery-content]');

        this.container.attr('data-liked', 0);
        this.parent.find('.like').trigger('soft-toggle-liked');

        content.html(content.html().replace(/data-liked=.1./, 'data-liked=""'));
    };

    /**
     * Hide this modal
     *
     * @return {void}
     */
    ModalCarousel.prototype.close = function () {
        this.active = false;

        this.container.fadeOut(250, $.proxy(function () {
            this.galleryWrapper.velocity('stop', true);
            this.container.remove();
            Scroll.updateLock();
        }, this));
    };


    /**
     * Retrieve the HTML content for the gallery from the element passed to the method,
     * looking for data-gallery-content
     *
     * @return {String}
     */
    ModalCarousel.prototype.getHtml = function () {
        var html = this.parent
            .find('[data-gallery-content]')
            .html()
            .trim();

        return html.substring(4, html.length - 6);
    };

    window.ModalCarousel = ModalCarousel;


    // Article cover
    $('body').on('click', '.cover-slide', function (e) {
        if (
            ( $(e.target).closest('.story-card').length === 0 ) &&
            ( $(e.target).closest('.edit-actions').length === 0 )
        ) {
            new ModalCarousel($(e.target).closest('.cover-slide'), 0);
    
            e.preventDefault();
        }
        
    });
    // Article featured
    $('body').on('click', '.recommended-editorials .main-image', function (e) {
        new ModalCarousel($(e.target).closest('.recommended-editorials'), 0);

        e.preventDefault();
    });
    // Article thumbnail
    $('body').on('click', '.story-card .cover-image', function (e) {
        new ModalCarousel($(e.target).closest('.story-card'), 0);

        e.preventDefault();
    });
    // Article details
    $('body').on('click', '.story img', function (e) {
        console.log(e);
        
        new ModalCarousel($(e.target).closest('.story'), 0);

        e.preventDefault();
    });
    
    // Property list item
    $('body').on('click', '.list-image.cover', function (e) {
        new ModalCarousel($(e.target).closest('.property-list-item'), 0);

        e.preventDefault();
    });

})(window, jQuery);
