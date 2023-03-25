; (function ($, window, pluginName) {
    "use strict";

    /**
     * @constructor
     * @param {jQuery} editorElement
     * @param {object} settings
     * @return {void}
     */
    function MediaComposer(editorElement, settings) {
        var that = this;

        this.editorElement = editorElement;

        this.settings = {
            class: {
                image: {
                    wide: settings.classes.image.wide,
                    grid: settings.classes.image.grid,
                    newContainer: settings.classes.image.container,
                },
                embed: {
                    wide: settings.classes.embed.wide,
                    newContainer: settings.classes.embed.container,
                }
            },
            selector: {
                media: settings.selectors.media,
                image: {
                    container: '.' + settings.classes.image.container,
                },
                embed: {
                    container: '.' + settings.classes.embed.container,
                }
            },
            preservedMediaContainerClasses: [
                'medium-insert-images-left',
                'medium-insert-images-right',
                'medium-insert-images-cropped',
                'medium-insert-images-full',
                'medium-insert-embeds-left',
                'medium-insert-embeds-right',
                'medium-insert-embeds-full',
            ],
            rowSize: 3
        };

        this.editorElement.find('img').one('load', function () {
            var container = $(this).closest(that.settings.selector.image.container).get(0);
            if (container) {
                that.updateImageRatio(0, container);
            }
        });
    }

    /**
     * Clear stored image class and caption
     *
     * @returns {void}
     */
    MediaComposer.prototype.resetMediaStore = function () {
        this.storedMediaClass = '';
        this.storedMediaCaption = '';
    };

    /**
     * Store a class name of a given container that was moved
     *
     * @param {DOM} container
     * @returns {void}
     */
    MediaComposer.prototype.storeMediaClass = function (container) {
        this.storedMediaClass =
            $.grep(this.settings.preservedMediaContainerClasses, function (val) {
                return container.hasClass(val);
            })[0] || '';
    };

    /**
     * Store caption of a given container
     *
     * @param {jQuery} container
     * @returns {void}
     */
    MediaComposer.prototype.storeMediaCaption = function (container) {
        this.storedMediaCaption =
            container.attr('data-caption') ||
            container.find('figcaption').text() ||
            container.find('.media-caption').val() ||
            '';
    };

    /**
     * Check if given node has any of preservable classes listed in this.settings.preservedMediaContainerClasses
     *
     * @param {DOM} node
     * @returns {boolean}
     */
    MediaComposer.prototype.hasPreservableClassNames = function (node) {
        return this.settings.preservedMediaContainerClasses
            .map(function (className) {
                return $(node).hasClass(className);
            })
            .filter(function (hasClassName) {
                return hasClassName;
            })
            .length > 0;
    };

    /**
     * Check if neighbors of a given node are grids
     *
     * @param {DOM} node
     * @returns {boolean}
     */
    MediaComposer.prototype.hasNearbyGrids = function (node) {
        return $(node).prev().hasClass(this.settings.class.image.grid) ||
               $(node).next().hasClass(this.settings.class.image.grid);
    };

    /**
     * Create a new image container
     *
     * @returns {jQuery}
     */
    MediaComposer.prototype.newImageContainer = function () {
        return $(templates.images(this.settings.class.image.newContainer, ''));
    };

    /**
     * Create a new embed container
     *
     * @returns {jQuery}
     */
    MediaComposer.prototype.newEmbedContainer = function () {
        return $(templates.embeds(this.settings.class.embed.newContainer, ''));
    };

    /**
     * Get all valid image containers
     *
     * @returns {jQuery}
     */
    MediaComposer.prototype.getImageContainers = function () {
        var containers = this.editorElement.find('> ' + this.settings.selector.image.container);

        if (this.pushDirection == 'down') {
            return containers;
        } else {
            return Array.prototype.reverse.call(containers);
        }
    };

    /**
     * Get all valid embed containers
     *
     * @returns {jQuery}
     */
    MediaComposer.prototype.getEmbedContainers = function () {
        var containers = this.editorElement.find('> ' + this.settings.selector.embed.container);

        if (this.pushDirection == 'down') {
            return containers;
        } else {
            return Array.prototype.reverse.call(containers);
        }
    };

    /**
     * Get all invalid figures
     *
     * @returns {jQuery}
     */
    MediaComposer.prototype.getStrandedFigures = function () {
        return this.editorElement.find('> ' + this.settings.selector.media);
    };

    /**
     * Update image container class names, remove empty containers and clear styles
     *
     * @param {number} i
     * @param {DOM} container
     * @returns {void}
     */
    MediaComposer.prototype.updateImageContainer = function (i, container) {
        var excess, $newContainer,
            $container = $(container),
            $nextContainer,
            $children = $container.children(this.settings.selector.media),
            children = $children.length,
            hasNearbyGrids = this.hasNearbyGrids(container),
            rowSize = this.settings.rowSize;

        $container.stop(true, true).removeAttr('style');

        $children.css({
            'height': ''
        });

        if (children === 0) {
            this.storeMediaClass($container);
            this.storeMediaCaption($container);
            $container.remove();

        } else if (children === 1 && hasNearbyGrids) {
            if (this.hasPreservableClassNames($container)) {
                $container.removeClass(this.settings.class.image.wide);
                $container.removeClass(this.settings.class.image.grid);
            } else {
                $container.removeClass(this.settings.class.image.wide);
                $container.addClass(this.settings.class.image.grid);
            }

        } else if (children === 1) {
            if (!this.hasPreservableClassNames($container)) {
                $container.addClass(this.settings.class.image.wide);
            }
            $container.removeClass(this.settings.class.image.grid);

        } else if (children > 1 && children <= rowSize) {
            $container.removeClass(this.settings.class.image.wide);
            $container.addClass(this.settings.class.image.grid);

        } else if (children > rowSize) {
            $container.removeClass(this.settings.class.image.wide);
            $container.addClass(this.settings.class.image.grid);

            if (this.pushDirection === 'down') {
                excess = $children.slice(rowSize);
                $nextContainer = $container.next();

                if ($nextContainer.is(this.settings.selector.image.container)) {
                    $nextContainer.prepend(excess);
                } else {
                    $newContainer = this.newImageContainer();
                    $container.after($newContainer);
                    $newContainer.prepend(excess);
                    this.updateImageContainer(i, $newContainer[0]);
                }
            } else {
                excess = $children.slice(0, children - rowSize);
                $nextContainer = $container.prev();

                if ($nextContainer.is(this.settings.selector.image.container)) {
                    if ($nextContainer.find('figcaption, .media-caption').length) {
                        $nextContainer.find('figcaption, .media-caption').before(excess);
                    } else {
                        $nextContainer.append(excess);
                    }
                } else {
                    $newContainer = this.newImageContainer();
                    $container.before($newContainer);
                    $newContainer.append(excess);
                    this.updateImageContainer(i, $newContainer[0]);
                }
            }
        }
    };

    /**
     * Remove empty embed containers
     *
     * @param {number} i
     * @param {DOM} container
     * @returns {void}
     */
    MediaComposer.prototype.updateEmbedContainer = function (i, container) {
        var $container = $(container),
            children = $container.children(this.settings.selector.media).length;

        if (children === 0) {
            this.storeMediaClass($container);
            this.storeMediaCaption($container);
            $container.remove();
        }
    };

    /**
     * Update figures without a container
     *
     * @param {number} i
     * @param {DOM} node
     * @returns {void}
     */
    MediaComposer.prototype.updateFigure = function (i, node) {
        var $container,
            hasNearbyGrids = this.hasNearbyGrids(node),
            isImage = node.firstElementChild.nodeName.toLowerCase() === 'img',
            isEmbed = node.firstElementChild.classList.contains('medium-insert-embed');

        if (isImage) {
            $container = this.newImageContainer();
        } else
        if (isEmbed) {
            $container = this.newEmbedContainer();
        }

        if (!$container) {
            return;
        }

        $(node).before($container);
        $container.append(node);

        if (this.storedMediaClass) {
            $container.addClass(this.storedMediaClass);
        } else {
            if (isImage) {
                $container.addClass(this.settings.class.image.wide);
            } else
            if (isEmbed) {
                $container.addClass(this.settings.class.embed.wide);
            }
        }

        if (this.storedMediaCaption) {
            $container.attr('data-caption', this.storedMediaCaption);
            $container.append('<figcaption>' + this.storedMediaCaption + '</figcaption>');
        }

        if (isImage) {
            if (hasNearbyGrids && !this.storedMediaClass) {
                $container.removeClass(this.settings.class.image.wide);
                $container.addClass(this.settings.class.image.grid);
            }
        }
    };

    /**
     * Update images aspect ratio
     *
     * @param {number} i
     * @param {DOM} node
     * @returns {void}
     */
    MediaComposer.prototype.updateImageRatio = function (i, node) {
        var total = 80,
            $container = $(node),
            $figures = $container.find('figure'),
            ratios = $.map($figures, function (figure) {
                var img = figure.firstElementChild,
                    width = img.naturalWidth || 1,
                    height = img.naturalHeight || 1;

                return width / height;
            }),
            sum = ratios.reduce(function (acc, val) {
                return acc + val
            });

        $.each($figures, function (i, figure) {
            var flex = Math.max(0, ratios[i] * total / sum);
            $(figure).css('flex-basis', flex + '%');
        });
    };

    /**
     * Handle containers after image drag
     *
     * @params {string} pushDirection - either 'up' or 'down', determines which direction exceeding images should be pushed in
     * @returns {void}
     */
    MediaComposer.prototype.updateMedia = function (pushDirection) {
        this.pushDirection = pushDirection || 'down';

        this.resetMediaStore();
        this.getImageContainers().each($.proxy(this, 'updateImageContainer'));
        this.getEmbedContainers().each($.proxy(this, 'updateEmbedContainer'));
        this.getStrandedFigures().each($.proxy(this, 'updateFigure'));
        this.getImageContainers().each($.proxy(this, 'updateImageRatio'));
    };

    /**
     * Plugin initialization
     */
    $.fn[pluginName] = function (settings, arg) {
        return this.each(function () {
            var $t = $(this),
                object = $t.data(pluginName);

            if (typeof settings === "string" && object) {
                $t.data(pluginName)[settings](arg);
            } else if (typeof settings === "undefined" ||
                typeof settings === "object") {
                $t.data(pluginName, new MediaComposer($t, settings));
            }
        });
    };

})(jQuery, window, 'mediaComposer');
