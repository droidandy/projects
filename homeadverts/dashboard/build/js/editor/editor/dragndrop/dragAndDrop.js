; (function ($, window, pluginName) {
    "use strict";

    /**
     * @constructor
     * @param {jQuery} editor
     * @param {object} settings
     * @return {void}
     */
    function DragAndDrop(editor, settings) {
        this.editor = editor;

        this.settings = {
            class: {
                placeholder: settings.classes.placeholder,
                placeholderGhost: settings.classes.placeholder + '-ghost',
                dragImage: 'dragged-images',
                dragEmbed: 'dragged-embeds',
                body: 'dragging',
                drag: 'dragged',
                image: {
                    container: settings.classes.image.container,
                    active: settings.classes.image.active,
                    activeImg: settings.classes.image.activeImg
                },
                embed: {
                    container: settings.classes.embed.container,
                    active: settings.classes.embed.active
                }
            },
            selector: {
                handle: settings.selectors.media,
                image: {
                    container: '.' + settings.classes.image.container,
                    grid: '.' + settings.classes.image.grid,
                },
                root: '> *',
                nested: '> *'
            },
            template: {
                placeholder: '<p class="' + settings.classes.placeholder + '" contenteditable="false"></p>',
                placeholderGhost: '<p class="' + settings.classes.placeholder + '-ghost" contenteditable="false"></p>'
            },
            animation: {
                length: 120,
                style: 'easeInOutQuad',
                width: 18,
                height: 18
            },
            size: {
                editorWidth: settings.sizes.editorWidth,
                gridWidth: settings.sizes.gridWidth
            },
            placeholderWidth: 3,
            excludeRoot: '.medium-insert-buttons, .placeholder, .placeholder-ghost',
            excludeNested: 'figcaption, .media-caption',
            tolerance: 15
        };

        this.placeholder = $(this.settings.template.placeholder);
        this.placeholderState = 'off';
        this.draggedMedia = [];
        this.rootTargets = null;
        this.nestedTargets = {};

        this.initEvents();
    }

    DragAndDrop.prototype.initEvents = function () {
        this.editor
            .on('dragstart', this.settings.selector.handle, $.proxy(this.dragstart, this));

        $(document)
            .on('dragend', $.proxy(this.dragend, this))
            .on('drop', $.proxy(this.drop, this));
    };

    /**
     * Check if number is between two other numbers
     *
     * @param {number} min
     * @param {number} x
     * @param {number} max
     * @returns {boolean}
     */
    DragAndDrop.prototype.isInside = function (min, x, max) {
        return x > min && x < max;
    };

    /**
     * Get position of mouse cursor
     *
     * @param {Event} e
     * @returns {object}
     */
    DragAndDrop.prototype.getPointer = function (e) {
        var o = e.originalEvent ||
                e.originalEvent.touches && e.originalEvent.touches[0];

        return {
            x: e.pageX || o.pageX,
            y: e.pageY || o.pageY
        }
    };

    /**
     * Get a regular max-width css value for a given container
     *
     * @param {DOM} container
     * @returns {number}
     */
    DragAndDrop.prototype.getContainerMaxWidth = function (container) {
        if ($(container).is(this.settings.selector.image.grid)) {
            return Math.min(window.innerWidth, this.settings.size.gridWidth);
        } else {
            return Math.min(window.innerWidth, this.settings.size.editorWidth);
        }
    };

    /**
     * Get a string representation of media type of a given figure
     * Returned media type is either 'image', 'embed' or a blank string
     *
     * @param {DOM} figure
     * @returns {string}
     */
    DragAndDrop.prototype.getMediaType = function (figure) {
        var parent = figure.parentNode;

        if (parent.classList.contains(this.settings.class.image.container)) {
            return 'image';
        } else
        if (parent.classList.contains(this.settings.class.embed.container)) {
            return 'embed';
        } else {
            return '';
        }
    };

    /**
     * Check if we're dragging any media items
     *
     * @returns {boolean}
     */
    DragAndDrop.prototype.isDraggingAnyMedia = function () {
        return this.draggedMedia.length > 0;
    };

    /**
     * Check if we're dragging exactly one media item
     *
     * @returns {boolean}
     */
    DragAndDrop.prototype.isDraggingOneMedia = function () {
        return this.draggedMedia.length === 1;
    };

    /**
     * Check if we're dragging pictures
     *
     * @returns {boolean}
     */
    DragAndDrop.prototype.isDraggingImages = function () {
        if (this.isDraggingAnyMedia()) {
            return this.getMediaType(this.draggedMedia[0]) === 'image';
        } else {
            return false;
        }
    };

    /**
     * Check if we're dragging embeds
     *
     * @returns {boolean}
     */
    DragAndDrop.prototype.isDraggingEmbeds = function () {
        if (this.isDraggingAnyMedia()) {
            return this.getMediaType(this.draggedMedia[0]) === 'embed';
        } else {
            return false;
        }

    };

    /**
     * Check if placeholder is in DOM
     *
     * @returns {boolean}
     */
    DragAndDrop.prototype.isPlaceholderAttached = function () {
        return $.contains(document, this.placeholder[0]);
    };

    /**
     * Check if a given target is a nesting container
     *
     * @param {object} pointer
     * @param {object} target
     * @returns {boolean}
     */
    DragAndDrop.prototype.isNestedContainer = function (pointer, target) {
        var isContainer = $(target.node).is(this.settings.selector.image.container),
            top = target.top + this.settings.tolerance,
            bottom = target.bottom - this.settings.tolerance;

        if (isContainer) {
            return this.isInside(top, pointer.y, bottom);
        } else {
            return false;
        }
    };

    /**
     * Get an array of drop targets between which we can put a placeholder
     *
     * @returns {object}
     */
    DragAndDrop.prototype.findRootDropTargets = function () {
        if (this.rootTargets) {
            return this.rootTargets;
        }

        return this.rootTargets = this.editor
            .find(this.settings.selector.root)
            .filter(':not(' + this.settings.excludeRoot + ')')
            .map(function (i, node) {
                var top = $(node).offset().top,
                    bottom = top + $(node).outerHeight();

                return {
                    node: node,
                    top: top,
                    bottom: bottom,
                    center: (top + bottom) / 2,
                    isNested: false
                };
            });
    };

    /**
     * Get an array of drop targets inside of a container between which we can put a placeholder
     *
     * @param {DOM} container
     * @returns {object}
     */
    DragAndDrop.prototype.findNestedDropTargets = function (container) {
        var index = $(container).prevAll(':not(' + this.settings.excludeRoot + ')').length;

        if (this.nestedTargets[index]) {
            return this.nestedTargets[index];
        }

        return this.nestedTargets[index] = $(container)
            .find(this.settings.selector.nested)
            .filter(':not(' + this.settings.excludeNested + ')')
            .map(function (i, node) {
                return {
                    node: node,
                    center: $(node).offset().left + $(node).outerWidth() / 2,
                    isNested: true
                };
            });
    };

    /**
     * Get a target that's closest to mouse cursor
     *
     * @param {object} pointer
     * @returns {object}
     */
    DragAndDrop.prototype.findClosestRootTarget = function (pointer) {
        var that = this,
            targets = this.findRootDropTargets();

        return targets
            .sort(function (a, b) {
                if (that.isInside(a.top, pointer.y, a.bottom)) {
                    return -1;
                }

                if (that.isInside(b.top, pointer.y, b.bottom)) {
                    return 1;
                }

                var distanceToA = Math.min(
                        Math.abs(pointer.y - a.top),
                        Math.abs(pointer.y - a.bottom)
                    ),
                    distanceToB = Math.min(
                        Math.abs(pointer.y - b.top),
                        Math.abs(pointer.y - b.bottom)
                    );
                return distanceToA - distanceToB;
            })[0];
    };

    /**
     * Get a target that's inside of a given node that's closest to mouse cursor
     *
     * @param {object} pointer
     * @param {DOM} node
     * @returns {object}
     */
    DragAndDrop.prototype.findClosestNestedTarget = function (pointer, node) {
        var targets = this.findNestedDropTargets(node);

        return targets
            .sort(function (a, b) {
                return Math.abs(a.center - pointer.x) - Math.abs(b.center - pointer.x);
            })[0];
    };

    /**
     * Get a target that's closest to mouse cursor, nested or not
     *
     * @param {object} pointer
     * @returns {object}
     */
    DragAndDrop.prototype.findClosestTarget = function (pointer) {
        var target = this.findClosestRootTarget(pointer);

        if (this.isDraggingImages() && this.isNestedContainer(pointer, target)) {
            return this.findClosestNestedTarget(pointer, target.node);
        } else {
            return target;
        }
    };

    /**
     * Turn dynamic placeholder on/off
     *
     * @param {string} method - either 'on' or 'off'
     * @returns {void}
     */
    DragAndDrop.prototype.togglePlaceholder = function (method) {
        if (this.placeholderState === method) {
            return;
        }

        $(document)[method]('dragover', $.proxy(this, 'dragover'));

        if (method === 'on') {
            this.editor.attr('contenteditable', false);
            this.beforePlaceholderAnimation();
        } else {
            this.editor.attr('contenteditable', true);
            this.resetLater();
        }

        this.placeholderState = method;
    };

    /**
     * Handle a pull back animation when placeholder is moved elsewhere
     *
     * @returns {void}
     */
    DragAndDrop.prototype.createPlaceholderGhost = function () {
        if (!this.isPlaceholderAttached()) {
            return;
        }

        var ghost = $(this.settings.template.placeholderGhost),
            marginTop = parseFloat( this.placeholder.css('margin-top') ) || 0,
            marginBottom = parseFloat( this.placeholder.css('margin-bottom') ) || 0,
            marginLeft = parseFloat( this.placeholder.css('margin-left') ) || 0,
            marginRight = parseFloat( this.placeholder.css('margin-right') ) || 0,
            borderTop = parseFloat( this.placeholder.css('border-top-width') ) || 0,
            borderBottom = parseFloat( this.placeholder.css('border-bottom-width') ) || 0,
            borderLeft = parseFloat( this.placeholder.css('border-left-width') ) || 0,
            borderRight = parseFloat( this.placeholder.css('border-right-width') ) || 0,
            $parent = this.placeholder.parent(),
            isNested = $parent.is(this.settings.selector.image.container),
            parentMaxWidth = this.getContainerMaxWidth($parent);

        ghost.css({
            marginTop: marginTop,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
            marginRight: marginRight,
            borderTopWidth: borderTop,
            borderBottomWidth: borderBottom,
            borderLeftWidth: borderLeft,
            borderRightWidth: borderRight
        });

        this.placeholder.replaceWith(ghost);

        ghost.animate({
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0
        }, this.settings.animation.length, this.settings.animation.style, function () {
            this.remove();
        });

        if (isNested) {
            $parent.stop(true, false).animate({
                maxWidth: parentMaxWidth
            }, this.settings.animation.length, this.settings.animation.style);
        }
    };

    /**
     * Make sure we don't have any ghosts near active placeholder
     *
     * @returns {void}
     */
    DragAndDrop.prototype.clearPlaceholderGhosts = function () {
        if (this.placeholder.prev().hasClass(this.settings.class.placeholderGhost)) {
            this.placeholder.prev().remove();
        }

        if (this.placeholder.next().hasClass(this.settings.class.placeholderGhost)) {
            this.placeholder.next().remove();
        }
    };

    /**
     * Account for margins around placeholder and run push animation
     *
     * @returns {void}
     */
    DragAndDrop.prototype.playPlaceholderAnimation = function () {
        var prevMargin, nextMargin, activeMargin,
            marginTop, marginBottom,
            $parent = this.placeholder.parent(),
            isNested = $parent.is(this.settings.selector.image.container),
            parentMaxWidth = this.getContainerMaxWidth($parent),
            prev = this.placeholder.prevAll(':not(' + this.settings.excludeRoot + ')').get(0),
            next = this.placeholder.nextAll(':not(' + this.settings.excludeRoot + ')').get(0),
            $prev = $(prev),
            $next = $(next);

        if (this.lastPrevOfPlaceholder === prev &&
            this.lastNextOfPlaceholder === next) {
            return;
        }

        this.lastPrevOfPlaceholder = prev;
        this.lastNextOfPlaceholder = next;

        this.placeholder.stop(true, true).removeAttr('style');

        if (isNested) {
            this.placeholder.css({
                marginLeft: -this.settings.placeholderWidth / 2,
                marginRight: -this.settings.placeholderWidth / 2
            });

            this.placeholder.animate({
                borderLeftWidth: this.settings.animation.width,
                borderRightWidth: this.settings.animation.width
            }, this.settings.animation.length, this.settings.animation.style, function () {
                this.style.opacity = '1';
            });

            $parent.stop(true, false).animate({
                maxWidth: parentMaxWidth + this.settings.animation.width * 2 + this.settings.placeholderWidth
            }, this.settings.animation.length, this.settings.animation.style);

        } else {
            prevMargin = parseFloat( $prev.css('margin-bottom') ) || 0;
            nextMargin = parseFloat( $next.css('margin-top') ) || 0;
            activeMargin = Math.max(prevMargin, nextMargin);

            marginTop = -prevMargin + activeMargin / 2 - this.settings.placeholderWidth / 2;
            marginBottom = -nextMargin + activeMargin / 2 - this.settings.placeholderWidth / 2;

            if ($prev.is(this.settings.selector.image.grid) &&
                $next.is(this.settings.selector.image.grid)) {
                marginTop -= 20;
                marginBottom -= 20;
            } else
            if ($prev.is(this.settings.selector.image.grid)) {
                marginTop += 20;
                marginBottom += 20;
            } else
            if ($next.is(this.settings.selector.image.grid)) {
                if (!prev) {
                    marginTop -= 20;
                    marginBottom -= 20;
                }
            }

            this.placeholder.css({
                marginTop: marginTop,
                marginBottom: marginBottom
            });

            this.placeholder.animate({
                borderTopWidth: this.settings.animation.height,
                borderBottomWidth: this.settings.animation.height
            }, this.settings.animation.length, this.settings.animation.style, function () {
                this.style.opacity = '1';
            });
        }
    };

    /**
     * Prepare containers for being animated
     *
     * @returns {void}
     */
    DragAndDrop.prototype.beforePlaceholderAnimation = function () {
        this.editor.css('height', this.editor.height());

        $(this.settings.selector.image.container).each(function (i, node) {
            $(node).css('max-width', node.getBoundingClientRect().width);
        });

        $(this.settings.selector.image.container + ' > ' + this.settings.selector.handle).each(function (i, node) {
            $(node).css('height', node.getBoundingClientRect().height);
        });
    };

    /**
     * Cleanup after placeholder's animation
     *
     * @returns {void}
     */
    DragAndDrop.prototype.afterPlaceholderAnimation = function () {
        $('.' + this.settings.class.placeholderGhost).remove();

        this.editor.css('height', '');

        $(this.settings.selector.image.container).stop(true, true).removeAttr('style');
        $(this.settings.selector.image.container + ' > ' + this.settings.selector.handle).css('height', '');

        this.lastPrevOfPlaceholder = null;
        this.lastNextOfPlaceholder = null;
    };

    /**
     * Create a smaller version of a dragged image and put it under the cursor
     *
     * @param {Event} e
     * @returns {void}
     */
    DragAndDrop.prototype.createDragImage = function (e) {
        var container, media;

        container = document.createElement('div');

        if (this.isDraggingImages()) {
            container.className = this.settings.class.dragImage;

            for (var i = 0; i < 3; i++) {
                if (!this.draggedMedia[i]) {
                    break;
                }

                media = document.createElement('img');
                media.src = this.draggedMedia[i].firstElementChild.src;
                media.style.top = (20 * i) + 'px';
                media.style.left = (10 * i) + 'px';

                container.appendChild(media);
            }
        } else if (this.isDraggingEmbeds()) {
            container.className = this.settings.class.dragEmbed;

            media = document.createElement('div');

            container.appendChild(media);
        }

        document.body.appendChild(container);
        container.offsetHeight; // force redraw
        e.originalEvent.dataTransfer.setDragImage(container, 0, 0);
    };

    /**
     * Remove drag image
     *
     * @returns {void}
     */
    DragAndDrop.prototype.removeDragImage = function () {
        $('.' + this.settings.class.dragImage).remove();
        $('.' + this.settings.class.dragEmbed).remove();
    };

    /**
     * Check if targeted position will result in no meaningful drag
     *
     * @param {DOM} target
     * @param {string} method - would-be placeholder attach method
     * @returns {boolean}
     */
    DragAndDrop.prototype.isTargetNearDragged = function (target, method) {
        if (!this.isDraggingOneMedia()) {
            return false;
        }

        var dragged = this.draggedMedia[0],
            $dragged = $(dragged),
            $container = $dragged.parent(),
            singleFigure = $container.children(this.settings.selector.handle).length === 1;

        return ( target === dragged ) ||

               ( method === 'before' &&
                 target === $dragged.next().get(0) ) ||

               ( method === 'after' &&
                 target === $dragged.prev().get(0) ) ||

               ( singleFigure &&
                 target === $container.get(0) ) ||

               ( singleFigure &&
                 method === 'before' &&
                 target === $container.next().get(0) ) ||

               ( singleFigure &&
                 method === 'after' &&
                 target === $container.prev().get(0) );
    };

    /**
     * Check if targeted position is after the last paragraph that is empty
     *
     * @param {DOM} target
     * @param {string} method - would-be placeholder attach method
     * @returns {boolean}
     */
    DragAndDrop.prototype.isTargetLastEmptyParagraph = function (target, method) {
        if (!target || method === 'before') {
            return false;
        }

        var next = $(target).nextAll(':not(' + this.settings.excludeRoot + ')').get(0);

        return !next &&
               target.nodeName.toLowerCase() === 'p' &&
               target.innerHTML === '<br>';
    };

    /**
     * Check if placeholder is already at the targeted spot
     *
     * @param {DOM} node
     * @param {string} method
     * @returns {boolean}
     */
    DragAndDrop.prototype.isPlaceholderHere = function (node, method) {
        var sibling;

        switch (method) {
            case 'before':
                sibling = node.previousSibling;
                break;

            case 'after':
                sibling = node.nextSibling;
                break;

            case 'detach':
                if (!this.isPlaceholderAttached()) {
                    return true;
                }
        }

        if (sibling &&
            sibling.className === this.settings.class.placeholder) {
            return true;
        }

        return false;
    };

    /**
     * Add drag-related classes and styles
     *
     * @returns {void}
     */
    DragAndDrop.prototype.beforeDrag = function () {
        $('body').addClass(this.settings.class.body);

        if (this.isDraggingAnyMedia()) {
            if ($.browser.isIE || $.browser.isEdge) {
                $(this.draggedMedia).css('opacity', 0.33);
            }
            $(this.draggedMedia).addClass(this.settings.class.drag);
        }
    };

    /**
     * Remove drag-related classes and styles
     *
     * @returns {void}
     */
    DragAndDrop.prototype.afterDrag = function () {
        $('body').removeClass(this.settings.class.body);

        if (this.isDraggingAnyMedia()) {
            if ($.browser.isIE || $.browser.isEdge) {
                $(this.draggedMedia).css('opacity', '');
            }
            $(this.draggedMedia).removeClass(this.settings.class.drag);
        }

        this.removeDragImage();
    };

    DragAndDrop.prototype.dragstart = function (e) {
        this.resetNow();

        var handle = $(e.target).closest(this.settings.selector.handle).get(0),
            multi = e.shiftKey || e.ctrlKey || e.metaKey,
            type = this.getMediaType(handle);

        switch (type) {
            case 'image':
                this.draggedMedia = $('.' + this.settings.class.image.activeImg).map(function (i, node) {
                    return node.parentNode;
                }).toArray();

                if (handle && this.draggedMedia.indexOf(handle) === -1) {
                    if (multi) {
                        this.draggedMedia.unshift(handle);
                    } else {
                        this.draggedMedia = [handle];
                    }
                }

                break;

            case 'embed':
                this.draggedMedia = [handle];
                break;
        }

        if (this.isDraggingAnyMedia()) {
            this.beforeDrag();
            this.togglePlaceholder('on');
            this.createDragImage(e);
        }
    };

    DragAndDrop.prototype.dragend = function () {
        this.afterDrag();
        this.togglePlaceholder('off');
    };

    DragAndDrop.prototype.dragover = function (e) {
        var dimension, method,
            pointer = this.getPointer(e),
            target = this.findClosestTarget(pointer);

        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';

        if (target.isNested) {
            dimension = 'x';
        } else {
            dimension = 'y';
        }

        if (target.center > pointer[dimension]) {
            method = 'before';
        } else {
            method = 'after';
        }

        if (this.isTargetLastEmptyParagraph(target.node, method)) {
            method = 'before';
        }

        if (this.isTargetNearDragged(target.node, method)) {
            method = 'detach';
        }

        if (this.isPlaceholderHere(target.node, method)) {
            return;
        }

        switch (method) {
            case 'before':
            case 'after':
                this.createPlaceholderGhost();
                $(target.node)[method](this.placeholder);
                this.clearPlaceholderGhosts();
                this.playPlaceholderAnimation();
                break;

            case 'detach':
                this.createPlaceholderGhost();
                this.placeholder[method]();
                this.lastPrevOfPlaceholder = null;
                this.lastNextOfPlaceholder = null;
                break;
        }
    };

    DragAndDrop.prototype.drop = function () {
        if (this.isPlaceholderAttached() && this.isDraggingAnyMedia()) {
            var isNested = this.placeholder.parent().is(this.settings.selector.image.container),
                pushDirection = 'down',
                template;

            this.afterDrag();

            if (isNested) {
                if (!this.placeholder.next(this.settings.selector.handle).length) {
                    pushDirection = 'up';
                }
            }

            if (this.isDraggingImages()) {
                if (this.isDraggingOneMedia() || isNested) {
                    this.placeholder.replaceWith(this.draggedMedia);
                } else {
                    template = $(templates.images(this.settings.class.image.container, ''));
                    template.append(this.draggedMedia);
                    this.placeholder.replaceWith(template);
                }
            } else
            if (this.isDraggingEmbeds()) {
                this.placeholder.replaceWith(this.draggedMedia);
            }

            $('.' + this.settings.class.image.active).removeClass(this.settings.class.image.active);
            $('.' + this.settings.class.image.activeImg).removeClass(this.settings.class.image.activeImg);
            $('.' + this.settings.class.embed.active).removeClass(this.settings.class.embed.active);
            this.draggedMedia = [];

            this.editor.mediaComposer('updateMedia', pushDirection);
            dispatchNewEvent('editorSave');
        }
    };

    /**
     * Reset drag'n'drop functionality and hide placeholder
     *
     * @returns {void}
     */
    DragAndDrop.prototype.resetNow = function () {
        this.placeholder.detach();
        this.afterPlaceholderAnimation();
        this.draggedMedia = [];
        this.rootTargets = null;
        this.nestedTargets = {};
    };

    /**
     * Schedule or reschedule plugin reset
     *
     * @returns {void}
     */
    DragAndDrop.prototype.resetLater = function (delay) {
        if (this.detachTimeout) {
            clearTimeout(this.detachTimeout);
            this.detachTimeout = null;
        }

        var that = this;

        this.detachTimeout = setTimeout(function () {
            that.resetNow();
        }, delay || 50);
    };

    /**
     * Plugin initialization
     */
    $.fn[pluginName] = function (settings, argument) {
        return this.each(function () {
            var $t = $(this),
                object = $t.data(pluginName);

            if (typeof settings === "string" && object) {
                $t.data(pluginName)[settings](argument);
            } else if (typeof settings === "undefined" ||
                typeof settings === "object") {
                $t.data(pluginName, new DragAndDrop($t, settings));
            }
        });
    };

})(jQuery, window, 'dragAndDrop');
