;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'mediumInsert';

    /**
     * Capitalize first character
     *
     * @param {string} str
     * @return {string}
     */

    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Core plugin's object
     *
     * Sets settings, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} settings - Options to override defaults
     * @return {void}
     */

    function Core(el, editor, settings) {
        this.el = el;
        this.$el = $(el);

        this.settings = {
            editor: editor.mediumEditor,
            enabled: true,
            class: {
                active: 'medium-insert-active',
                action: 'medium-insert-action',
                toolbarAction: 'medium-editor-action'
            },
            selector: {
                active: '.medium-insert-active',
                buttons: '.medium-insert-buttons',
                toolbar: '.medium-editor-toolbar',
                leftFloats: '.medium-insert-images-left, .medium-insert-embeds-left'
            },
            size: {
                editorWidth: settings.sizes.editorWidth,
                floatWidth: settings.sizes.floatWidth,
                gridWidth: settings.sizes.gridWidth,
                mediumButtonOffset: settings.sizes.mediumButtonOffset
            },
            addons: {
                images: {
                    fileUploadOptions: {
                        url: editor.actions.uploadFile
                    }
                },
                embeds: true
            }
        };

        this._name = pluginName;

        // Extend editor's functions
        if (this.settings && this.settings.editor) {
            if (this.settings.editor._serialize === undefined) {
                this.settings.editor._serialize = this.settings.editor.serialize;
            }
            if (this.settings.editor._destroy === undefined) {
                this.settings.editor._destroy = this.settings.editor.destroy;
            }
            if (this.settings.editor._setup === undefined) {
                this.settings.editor._setup = this.settings.editor.setup;
            }
            this.settings.editor._hideInsertButtons = this.hideButtons;

            this.settings.editor.serialize = this.editorSerialize;
            this.settings.editor.destroy = this.editorDestroy;
            this.settings.editor.setup = this.editorSetup;

            if (this.settings.editor.getExtensionByName('placeholder') !== undefined) {
                this.settings.editor.getExtensionByName('placeholder').updatePlaceholder = this.editorUpdatePlaceholder;
            }
        }
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Core.prototype.init = function () {
        this.$el.addClass('medium-editor-insert-plugin');

        if (typeof this.settings.addons !== 'object' || Object.keys(this.settings.addons).length === 0) {
            this.disable();
        }

        this.initAddons();
        this.clean();
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Core.prototype.events = function () {
        $(document).bind('drop dragover', function (e) {
            e.preventDefault();
        });

        this.$el
            .on('keyup click dragstart focusout', $.proxy(this, 'toggleButtons'))
            .on('keydown keyup keypress', $.proxy(this, 'updateMissingPlaceholder'))
            .on('selectstart mousedown', '.medium-insert, .medium-insert-buttons', $.proxy(this, 'disableSelection'))
            .on('click', '.medium-insert-buttons-show', $.proxy(this, 'toggleAddons'))

        $(document)
            .on('click', '.medium-insert-action', $.proxy(this, 'addonAction'));

        $(window).on('resize', $.proxy(this, 'positionButtons', null));
    };

    /**
     * Return editor instance
     *
     * @return {object} MediumEditor
     */

    Core.prototype.getEditor = function () {
        return this.settings.editor;
    };



    Core.prototype.editorSerialize = function () {
        var data = this._serialize();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value);

            $data.find('.medium-insert-buttons').remove();
            $data.find('.medium-insert-active img').removeClass('medium-insert-image-active');

            // Restore original embed code from embed wrapper attribute value.
            $data.find('[data-embed-code]').each(function () {
                var $this = $(this),
                    html = $('<div />').html($this.attr('data-embed-code')).text();
                $this.html(html);
            });

            // Convert textareas into captions
            $data.find('.medium-insert-images, .medium-insert-embeds').each(function () {
                var $this = $(this);
                var text = $this.attr('data-caption');
                var caption = $this.find('.media-caption');

                if (text) {
                    caption.replaceWith('<figcaption>'+text+'</figcaption>');
                } else {
                    caption.remove();
                }

                $this.removeAttr('data-caption');
                $this.removeClass('medium-insert-active');
            });

            data[key].value = $data.html().trim();
        });

        return data;
    };

    /**
     * Extend editor's destroy function to deactivate this plugin too
     *
     * @return {void}
     */

    Core.prototype.editorDestroy = function () {
        $.each(this.elements, function (key, el) {
            if ($(el).data('plugin_' + pluginName) instanceof Core) {
                $(el).data('plugin_' + pluginName).disable();
            }
        });

        this._destroy();
    };

    /**
     * Extend editor's setup function to activate this plugin too
     *
     * @return {void}
     */

    Core.prototype.editorSetup = function () {
        this._setup();

        $.each(this.elements, function (key, el) {
            if ($(el).data('plugin_' + pluginName) instanceof Core) {
                $(el).data('plugin_' + pluginName).enable();
            }
        });
    };

    /**
     * Extend editor's placeholder.updatePlaceholder function to show placeholder dispite of the plugin buttons
     *
     * @return {void}
     */

    Core.prototype.editorUpdatePlaceholder = function (el, dontShow) {
        var contents = $(el).children()
            .not('.medium-insert-buttons').contents();

        if (!dontShow && contents.length === 1 && contents[0].nodeName.toLowerCase() === 'br') {
            this.showPlaceholder(el);
            this.base._hideInsertButtons($(el));
        } else {
            this.hidePlaceholder(el);
        }
    };

    /**
     * Trigger editableInput on editor
     *
     * @return {void}
     */

    Core.prototype.triggerInput = function () {
        if (this.getEditor()) {
            this.getEditor().trigger('editableInput', null, this.el);
        }
    };

    /**
     * Deselects selected text
     *
     * @return {void}
     */

    Core.prototype.deselect = function () {
        document.getSelection().removeAllRanges();
    };

    /**
     * Disables the plugin
     *
     * @return {void}
     */

    Core.prototype.disable = function () {
        this.settings.enabled = false;

        this.$el.find(this.settings.selector.buttons).addClass('hide');
    };

    /**
     * Enables the plugin
     *
     * @return {void}
     */

    Core.prototype.enable = function () {
        this.settings.enabled = true;

        this.$el.find(this.settings.selector.buttons).removeClass('hide');
    };

    /**
     * Disables selectstart mousedown events on plugin elements except images
     *
     * @return {void}
     */

    Core.prototype.disableSelection = function (e) {
        var $el = $(e.target);

        if ($el.is('img') === false || $el.hasClass('medium-insert-buttons-show')) {
            e.preventDefault();
        }
    };

    /**
     * Initialize addons
     *
     * @return {void}
     */

    Core.prototype.initAddons = function () {
        var that = this;

        if (!this.settings.addons || this.settings.addons.length === 0) {
            return;
        }

        $.each(this.settings.addons, function (addon, settings) {
            var addonName = pluginName + ucfirst(addon);

            if (settings === false) {
                delete that.settings.addons[addon];
                return;
            }

            that.$el[addonName](settings);
            that.settings.addons[addon] = that.$el.data('plugin_' + addonName).settings;
        });
    };

    /**
     * Cleans a content of the editor
     *
     * @return {void}
     */

    Core.prototype.clean = function () {
        var that = this,
            $buttons, $lastEl, $text;

        if (this.settings.enabled === false) {
            return;
        }

        if (this.$el.children().length === 0) {
            this.$el.html(window.templates.line);
        }

        // Fix #29
        // Wrap content text in <p></p> to avoid Firefox problems
        $text = this.$el
            .contents()
            .filter(function () {
                return (this.nodeName === '#text' && $.trim($(this).text()) !== '') || this.nodeName.toLowerCase() === 'br';
            });

        $text.each(function () {
            $(this).wrap('<p />');

            // Fix #145
            // Move caret at the end of the element that's being wrapped
            that.moveCaret($(this).parent(), $(this).text().length);
        });

        this.addButtons();

        $buttons = this.$el.find(this.settings.selector.buttons);
        $lastEl = $buttons.prev();

        if ($lastEl.attr('class') && $lastEl.attr('class').match(/medium\-insert(?!\-active)/)) {
            $buttons.before(window.templates.line);
        }
    };

    /**
     * Returns HTML template of buttons
     *
     * @return {string} HTML template of buttons
     */
    Core.prototype.getButtons = function () {
        if (this.settings.enabled === false) {
            return;
        }

        return window.templates.buttons(this.settings.addons);
    };

    /**
     * Appends buttons at the end of the $el
     *
     * @return {void}
     */
    Core.prototype.addButtons = function () {
        if (this.$el.find(this.settings.selector.buttons).length === 0) {
            this.$el.append(this.getButtons());
        }
    };

    /**
     * Appends addon buttons to medium-editor toolbar
     *
     * @returns {void}
     */
    Core.prototype.addToolbarButtons = function () {
        var $toolbarList = $(this.settings.selector.toolbar).find('ul');

        $toolbarList.append("<li style='flex: 1'></li>");

        $toolbarList.append(" \
            <li> \
                <button class='" + this.settings.class.toolbarAction + " " + this.settings.class.action + "' data-addon='images' data-action='add' title='Image' aria-label='Image'> \
                    <i class='material-icons'>photo</i> \
                </button> \
            </li> \
        ");

        $toolbarList.append(" \
            <li> \
                <button class='" + this.settings.class.toolbarAction + " " + this.settings.class.action + " medium-editor-button-last' data-addon='embeds' data-action='add' title='Embed' aria-label='Embed'> \
                    <i class='material-icons'>play_circle_filled</i> \
                </button> \
            </li> \
        ");
    };

    /**
     * Move buttons to current active, empty paragraph and show them
     *
     * @return {void}
     */
    Core.prototype.toggleButtons = function (e) {
        if (e.type === 'focusout' && window.innerWidth <= this.settings.size.tabletWidth) {
            return;
        }

        var $el = $(e.target),
            selection = window.getSelection(),
            that = this,
            skipShowButtons = false,
            range, $current, $p, activeAddon;

        if (!selection || selection.rangeCount === 0) {
            $current = $el;
        } else {
            range = selection.getRangeAt(0);
            $current = $(range.commonAncestorContainer);
        }

        // When user clicks on editor's placeholder in FF, $current el is editor itself, not the first paragraph as it should
        if ($current.hasClass('medium-editor-insert-plugin')) {
            $current = $current.find('p:first');
        }

        $p = $current.is('p') ? $current : $current.closest('p');

        this.lastActiveParagraph = $p;

        this.clean();

        if ($el.closest(this.settings.selector.buttons).length === 0 && $current.closest(this.settings.selector.buttons).length === 0) {

            this.$el.find(this.settings.selector.active).removeClass(this.settings.class.active);

            $.each(this.settings.addons, function (addon) {
                if ($el.closest('.medium-insert-' + addon).length) {
                    $current = $el;
                }

                if ($current.closest('.medium-insert-' + addon).length) {
                    $p = $current.closest('.medium-insert-' + addon);
                    activeAddon = addon;
                    return;
                }
            });

            if (e.type === 'focusout') {
                skipShowButtons = !this.addonActionTimeStamp || e.timeStamp > this.addonActionTimeStamp + 1000;
            }

            if ($p.length && (($p.text().trim() === '' && !activeAddon) || activeAddon === 'images') && !skipShowButtons) {

                $p.addClass(this.settings.class.active);

                if (activeAddon === 'images') {
                    this.$el.find(this.settings.selector.buttons).attr('data-active-addon', activeAddon);
                    this.hideButtons();
                } else {
                    this.$el.find(this.settings.selector.buttons).removeAttr('data-active-addon');

                    this.positionUpdateInterval = setInterval(function () {
                        that.positionButtons();
                    }, 16);
                    setTimeout(function () {
                        clearInterval(that.positionUpdateInterval);
                    }, 500);

                    this.positionButtons();
                    this.showButtons();
                }
            } else {
                this.hideButtons();
            }
        }
    };

    /**
     * @param {Event} e
     * @returns {void}
     */
    Core.prototype.updateMissingPlaceholder = function (e) {
        if (e.which === 8) {
            if (this.$el.children().first().hasClass('medium-insert-buttons')) {
                this.$el.html(window.templates.line);
                this.addButtons();
            }
        }
    };

    /**
     * Show buttons
     *
     * @returns {void}
     */

    Core.prototype.showButtons = function () {
        var $buttons = this.$el.find(this.settings.selector.buttons);

        $buttons.show();
        $buttons.find('li').show();
    };

    /**
     * Hides buttons
     *
     * @param {jQuery} $el - Editor element
     * @returns {void}
     */

    Core.prototype.hideButtons = function ($el) {
        $el = $el || this.$el;

        $el.find(this.settings.selector.buttons).hide();
        $el.find(this.settings.selector.buttons + '-addons').removeClass('visible');
        $el.find(this.settings.selector.buttons + '-show').removeClass('medium-insert-buttons-rotate');
        $el.removeClass('media-insert-visible');
    };

    /**
     * Position buttons
     *
     * @return {void}
     */

    Core.prototype.positionButtons = function () {
        var $buttons = this.$el.find(this.settings.selector.buttons),
            $p = this.$el.find(this.settings.selector.active) || this.$el.find('p.medium-editor-placeholder'),
            elementsContainer = this.getEditor() ? this.getEditor().options.elementsContainer : $('body').get(0),
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            $leftFloat, $floatFirstChild, currentLineTop, leftFloatBottom,
            position = {};

        if ($p.length) {
            position.transform = '';
            position.top = $p.position().top;
            position.top += parseInt( $p.css('margin-top') );

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop;
            }

            $leftFloat = $p.prevAll(this.settings.selector.leftFloats).first();
            if ($leftFloat.length && window.innerWidth >= this.settings.size.floatWidth) {
                currentLineTop = $p.get(0).getBoundingClientRect().top;
                leftFloatBottom = $leftFloat.children().last().get(0).getBoundingClientRect().bottom;
                if (leftFloatBottom > currentLineTop) {
                    $floatFirstChild = $leftFloat.children().first();
                    position.transform = 'translate(' + (
                        $floatFirstChild.width() +
                        parseInt( $floatFirstChild.css('margin-left').replace('px', '') ) +
                        parseInt( $floatFirstChild.css('margin-right').replace('px', '') ) -
                        this.settings.size.mediumButtonOffset
                    ) + 'px, 0)';
                }
            }

            $buttons.css(position);
        }
    };

    /**
     * Toggles addons buttons
     *
     * @return {void}
     */

    Core.prototype.toggleAddons = function () {
        if (this.$el.find(this.settings.selector.buttons).attr('data-active-addon') === 'images') {
            this.$el.find(this.settings.selector.buttons).find('button[data-addon="images"]').click();
            return;
        }

        this.$el.find(this.settings.selector.buttons + '-addons').toggleClass('visible');
        this.$el.find(this.settings.selector.buttons + '-show').toggleClass('medium-insert-buttons-rotate');

        if (this.$el.find(this.settings.selector.buttons + '-show').hasClass('medium-insert-buttons-rotate')) {
            this.$el.addClass('media-insert-visible');
        } else {
            this.$el.removeClass('media-insert-visible');
        }
    };

    /**
     * Hide addons buttons
     *
     * @return {void}
     */

    Core.prototype.hideAddons = function () {
        this.$el.find(this.settings.selector.buttons + '-addons').removeClass('visible');
        this.$el.find(this.settings.selector.buttons + '-show').removeClass('medium-insert-buttons-rotate');
        this.$el.removeClass('media-insert-visible');
    };

    /**
     * Call addon's action
     *
     * @param {Event} e
     * @return {void}
     */

    Core.prototype.addonAction = function (e) {
        var $a = $(e.currentTarget),
            addon = $a.data('addon'),
            action = $a.data('action');

        if (window.innerWidth <= this.settings.size.tabletWidth) {
            this.ensureActiveLine();
        }

        this.addonActionTimeStamp = e.timeStamp;
        this.$el.data('plugin_' + pluginName + ucfirst(addon))[action]();
    };

    /**
     * Insert a new line if needed
     *
     * @return {void}
     */

    Core.prototype.ensureActiveLine = function () {
        if ($(this.settings.selector.active).length) {
            return;
        }

        var $p = this.lastActiveParagraph,
            template;

        if (!$p) {
            $p = this.$el.children().last().prev();
        }

        if ($p.html() !== '<br>') {
            template = $(templates.line);
            $p.after(template);
            $p = template;
        }

        $p.addClass(this.settings.class.active);
    }

    /**
     * Move caret at the beginning of the empty paragraph
     *
     * @param {jQuery} $el Element where to place the caret
     * @param {integer} position Position where to move caret. Default: 0
     *
     * @return {void}
     */

    Core.prototype.moveCaret = function ($el, position) {
        var range, sel, el, textEl;

        position = position || 0;
        range = document.createRange();
        sel = window.getSelection();
        el = $el.get(0);

        if (!el.childNodes.length) {
            textEl = document.createTextNode(' ');
            el.appendChild(textEl);
        }

        range.setStart(el.childNodes[0], position);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    /**
     * @param {jQuery Element} $el
     * @param {string} placeholder
     * @return {void}
     */
    Core.prototype.addCaption = function ($el, placeholder) {
        var template, $newCaption,
            $caption = $el.find('.media-caption'),
            $figcaption = $el.find('figcaption');

        if ($figcaption.length) {
            template = window.templates.caption(placeholder, $figcaption.text());
            $newCaption = $(template);

            $figcaption.replaceWith($newCaption);
        } else
        if ($caption.length === 0) {
            template = window.templates.caption(placeholder);
            $newCaption = $(template);
            $newCaption.addClass('hidden');

            $el.append($newCaption);

            setTimeout(function () {
                $newCaption.removeClass('hidden');
            }, 30);
        }

        // Autosize for caption textareas
        autosize($('.media-caption'));
    };

    /**
     * @param {jQuery Element} $ignore
     * @return {void}
     */
    Core.prototype.removeCaptions = function ($ignore) {
        var $captions = this.$el.find('.media-caption');

        if ($ignore) {
            $captions = $captions.not($ignore);
        }

        $captions.each(function () {
            var $caption = $(this);

            if ($caption.val().trim() === '') {
                $caption.addClass('hidden');

                setTimeout(function () {
                    $caption.remove();
                }, 800)
            }
        });
    };

    $.fn[pluginName] = function (settings, editor) {
        return this.each(function () {
            var that = this,
                textareaId;

            if ($(that).is('textarea')) {
                textareaId = $(that).attr('medium-editor-textarea-id');
                that = $(that).siblings('[medium-editor-textarea-id="' + textareaId + '"]').get(0);
            }

            if (!$.data(that, 'plugin_' + pluginName)) {
                // Plugin initialization
                $.data(that, 'plugin_' + pluginName, new Core(that, editor, settings));
                $.data(that, 'plugin_' + pluginName).init();
            } else if (typeof settings === 'string' && $.data(that, 'plugin_' + pluginName)[settings]) {
                // Method call
                $.data(that, 'plugin_' + pluginName)[settings]();
            }
        });
    };

})(jQuery, window, document);
