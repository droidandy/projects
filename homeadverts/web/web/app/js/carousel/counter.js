;(function (window, $) {
    'use strict';

    function CarouselCounter(carousel, type) {
        var containerClass = '.counter-wrapper';

        this.carousel = carousel;
        this.containers = this.carousel.find('.gallery-cell ' + containerClass);

        if (type === 'modal') {
            this.dynamicContainer = this
                .carousel
                .parent()
                .siblings('.gallery-toolbar')
                .find(containerClass);
        }

        this.initialize();
    }

    CarouselCounter.prototype.initialize = function () {
        var _this = this;

        this.containers.each(function (i, node) {
            $(node).append(_this.newStaticCounter(i));
        });

        if (this.dynamicContainer) {
            this.dynamicCounter = this.newDynamicCounter();
            this.dynamicContainer.append(this.dynamicCounter);
        }
    };

    CarouselCounter.prototype.getCurrent = function () {
        return this.carousel.data('flickity').selectedIndex + 1;
    };

    CarouselCounter.prototype.getTotal = function () {
        return this.carousel.data('flickity').cells.length;
    };

    CarouselCounter.prototype.newStaticCounter = function (index) {
        return $('<div class="flickity-counter">' + (index + 1) + '/' + this.getTotal() + '</div>');
    };

    CarouselCounter.prototype.newDynamicCounter = function () {
        return $('<div class="flickity-counter">1/' + this.getTotal() + '</div>');
    };

    CarouselCounter.prototype.update = function () {
        if (!this.dynamicCounter) {
            return;
        }

        var current = this.getCurrent(),
            total = this.getTotal();

        this.dynamicCounter.text(current + '/' + total);
    };

    window.CarouselCounter = CarouselCounter;

})(window, jQuery);
