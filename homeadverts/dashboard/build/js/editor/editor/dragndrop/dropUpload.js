; (function ($, window, pluginName, undefined) {
    'use strict';

    function DropUpload(el, settings) {
        this.editor = el;

        this.settings = {
            class: {
                image: {
                    container: settings.classes.image.container,
                    active: settings.classes.image.active
                },
            },
            selector: {
                placeholder: '.' + settings.classes.placeholder
            }
        };

        this.dragging = false;

        this.initEvents();
    }

    DropUpload.prototype.initEvents = function () {
        $(document)
            .on('dragleave', $.proxy(this, 'dragleave'))
            .on('mousemove', $.proxy(this, 'mousemove'))
            .on('dragover', $.proxy(this, 'dragover'))
            .on('drop', $.proxy(this, 'drop'));
    };

    /**
     * Check if dragover event has a file dragged
     *
     * @param {Event} event
     * @returns {boolean}
     */
    DropUpload.prototype.isFileDrag = function (event) {
        var i,
            types = event.originalEvent.dataTransfer.types,
            files = false;

        for (i = 0; i < types.length; i++) {
            if (types[i] == 'Files') {
                files = true;
            }

            if (types[i].indexOf('text') === 0 &&
                types[i] !== 'text/uri-list') {
                return false;
            }
        }

        return files;
    };

    DropUpload.prototype.placeholder = function () {
        return $(this.settings.selector.placeholder);
    };

    /**
     * Check if placeholder is in DOM
     *
     * @returns {boolean}
     */
    DropUpload.prototype.isPlaceholderAttached = function () {
        return $.contains(document, this.placeholder()[0]);
    };

    DropUpload.prototype.reset = function () {
        this.dragging = false;
        this.editor.dragAndDrop('togglePlaceholder', 'off');
        this.editor.dragAndDrop('resetLater');
    };

    /**
     * Hide placeholder when drag leaves window area
     *
     * @param {Event} e
     * @returns {void}
     */
    DropUpload.prototype.dragleave = function (e) {
        if (this.dragging) {
            if (!$.browser.isSafari && e.relatedTarget === null) {
                this.reset();
            }
        }
    };

    /**
     * A Safari-specific workaround for drag leave detection
     *
     * @returns {void}
     */
    DropUpload.prototype.mousemove = function () {
        if (this.dragging && $.browser.isSafari) {
            this.reset();
        }
    };

    /**
     * Put a placeholder between elements
     *
     * @param {Event} e
     * @returns {void}
     */
    DropUpload.prototype.dragover = function (e) {
        if (!this.isFileDrag(e)) return;

        e.preventDefault();

        this.editor.dragAndDrop('togglePlaceholder', 'on');
        this.dragging = true;
    };

    /**
     * Replace placeholder with a new line and initiate mediumInsertImages upload
     *
     * @param {Event} e
     * @returns {void}
     */
    DropUpload.prototype.drop = function (e) {
        e.preventDefault();

        var data = e.originalEvent.dataTransfer;

        if (!this.isPlaceholderAttached() ||
            !data ||
            !data.files.length) return;

        var $next, $prev, $line,
            $placeholder = this.placeholder(),
            activeClass = this.settings.class.image.active,
            method;

        $('.' + activeClass).removeClass(activeClass);

        if ($placeholder.parent().hasClass(this.settings.class.image.container)) {
            $next = $placeholder.next();
            $prev = $placeholder.prev();

            if ($next.length && $next.is('figure')) {
                $next.addClass(activeClass);
                method = 'before';
            } else {
                $prev.addClass(activeClass);
                method = 'after';
            }
        } else {
            $line = $(window.templates.line);
            $line.addClass(activeClass);
            $placeholder.replaceWith($line);
            method = 'append';
        }

        this.editor.mediumInsertImages('drop', data, method);

        this.rootTargets = null;
        this.nestedTargets = null;

        this.reset();
    };

    /**
     * Plugin initialization
     */
    $.fn[pluginName] = function (settings) {
        return this.map(function () {
            var $t = $(this),
                object = $t.data(pluginName);

            if (!object && ( settings === undefined ||
                typeof settings === "object" )) {
                $t.data(pluginName, new DropUpload($t, settings));
            }

            return this;
        });
    };

})(jQuery, window, 'dropUpload');
