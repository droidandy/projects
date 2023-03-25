;(function (window, $) {
    "use strict";

    function PrimaryMediaSelection(className) {
        this.className = className;
        this.mediaSelection = $(className);

        if (!this.mediaSelection.length) {
            return;
        }

        this.carousels = [];
        this.primaryMediaUrl = this.mediaSelection.attr('data-primary-media-url');

        this.init();
        this.buildCarousel();
    }

    PrimaryMediaSelection.prototype.init = function () {
        var _this = this;

        this.mediaSelection.map(function () {
            _this.carousels = _this.mediaSelection.flickity();
        });

        $('body').on('click', this.className + ' .carousel-cell', function (el) {
            _this.select($(el.target));
        });

        window.addEventListener('editorImagesUploadingSuccess', function () {
            _this.buildCarousel();
        }, false);

        window.addEventListener('editorImageRemoved', function () {
            _this.buildCarousel();
        }, false);
    };

    PrimaryMediaSelection.prototype.buildCarousel = function () {
        var _this = this;
        var index = 0;
        var selectMediaSection = $('.section-media');
        var medias = $('.medium-insert-images img');


        if (medias.length) {
            selectMediaSection.addClass('--contains-media');
            $('.carousel-cell').remove();

            medias.map(function (i, item) {
                var url = $(item).attr('src');
                var classes = 'cover carousel-cell';

                if (url == _this.primaryMediaUrl) {
                    classes = classes + ' primary-media';
                    index = i;
                }

                _this.mediaSelection.append('<div data-number="' + i + '" ' +
                    'style="background-image: url(' + url + ')" ' +
                    'class="' + classes + '"></div>');
            });

            setTimeout(function () {
                _this.rebuildCarousels(index, medias.length);
            }, 1000);
        }
    };

    /**
     * @param {int} initialIndex
     * @param {int} count
     */
    PrimaryMediaSelection.prototype.rebuildCarousels = function (initialIndex, count) {
        var isDraggable = count > 4;

        this.carousels.map(function (i, item) {
            var carousel = $(item);
            var config = {};

            if (isDraggable) {
                config = {
                    cellAlign: 'left',
                    initialIndex: initialIndex,
                    draggable: true,
                    wrapAround: true,
                    contain: false
                };
            } else {
                config = {
                    cellAlign: 'left',
                    draggable: false,
                    contain: false
                };
            }

            carousel.flickity('destroy');
            carousel.flickity(config);
        });
    };

    PrimaryMediaSelection.prototype.select = function (el) {
        var url = el
            .css('background-image')
            .replace('url(', '')
            .replace(')', '')
            .replace(/\"/gi, "");
        var number = el.attr('data-number');

        // Tumbnails in dropdown
        $(this.className + ' .carousel-cell').removeClass('primary-media');
        $(this.className + ' .carousel-cell[data-number="' + number + '"]').addClass('primary-media');

        // Story images
        $('figure img').removeClass('primary-media');
        $('figure img[src="' + url + '"]').addClass('primary-media');

        dispatchNewEvent('editorSave');
    };


    $(document).ready(function () {
        new PrimaryMediaSelection('.primary-media-selection');
    });

})(window, jQuery);
