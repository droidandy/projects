; (function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Embeds', // first char is uppercase
        lockedWidthSources = [
            'url=https%3A%2F%2Fwww.facebook.com',
            'url=https%3A%2F%2Fwww.instagram.com'
        ],
        nonResponsiveSources = [
            'url=https%3A%2F%2Ftwitter.com',
            'url=https%3A%2F%2Fwww.facebook.com',
            'url=https%3A%2F%2Fwww.instagram.com'
        ],
        lockedRatioSources = [
            'url=https%3A%2F%2Fvimeo.com'
        ],
        defaults = {
            label: '<i class="material-icons">play_arrow</i>',
            placeholder: 'Paste a link to embed content from another site and press Enter',
            oembedProxy: 'https://iframe.ly/api/oembed?iframe=1&api_key='+window.iframelyKey,
            captionPlaceholder: 'Type caption for media (optional)',
            storeMeta: false,
            class: {
                container: 'medium-insert-embeds',
                active: 'medium-insert-embeds-active',
                placeholder: 'medium-insert-embeds-placeholder',
            },
            selector: {
                toolbar: '.medium-insert-embeds-toolbar',
                toolbar2: '.medium-insert-embeds-toolbar2',
            },
            styles: {
                left: {
                    label: '<span class="editor-image-left"></span>',
                    except: lockedWidthSources
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                right: {
                    label: '<span class="editor-image-right"></span>',
                    except: lockedWidthSources
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                wide: {
                    label: '<span class="editor-image-wide"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                full: {
                    label: '<span class="editor-image-crop"></span>',
                    except: nonResponsiveSources
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                cropped: {
                    label: '<span class="editor-image-fullpage"></span>',
                    except: nonResponsiveSources.concat(lockedRatioSources)
                    // added: function ($el) {},
                    // removed: function ($el) {}
                }
            },
            actions: {},
            parseOnPaste: false
        };

    /**
     * Embeds object
     *
     * Sets settings, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} settings - Options to override defaults
     * @return {void}
     */

    function Embeds(el, settings) {
        this.el = el;
        this.$el = $(el);
        this.core = this.$el.data('plugin_' + pluginName);

        this.settings = $.extend(true, {}, defaults, settings);

        this._defaults = defaults;
        this._name = pluginName;

        // Extend editor's functions
        if (this.core.getEditor()) {
            this.core.getEditor()._serializePreEmbeds = this.core.getEditor().serialize;
            this.core.getEditor().serialize = this.editorSerialize;
        }

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */
    Embeds.prototype.init = function () {
        var $embeds = this.$el.find('.medium-insert-embeds');

        $embeds.each(function () {
            if ($(this).find('.medium-insert-embeds-overlay').length === 0) {
                $(this)
                    .find('.medium-insert-embed')
                    .append($('<div />')
                    .addClass('medium-insert-embeds-overlay'));
            }
        });

        this.initCaptions();
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */
    Embeds.prototype.events = function () {
        $(document)
            .on('click', $.proxy(this, 'unselectEmbed'))
            .on('keydown', $.proxy(this, 'removeEmbed'))
            .on('click', this.settings.selector.toolbar + ' .medium-editor-action', $.proxy(this, 'toolbarAction'))
            .on('dragstart', $.proxy(this, 'hideToolbarAndCaption'));

        this.$el
            .on('keyup click paste', $.proxy(this, 'togglePlaceholder'))
            .on('keydown', $.proxy(this, 'processLink'))
            .on('keydown keyup keypress', '.' + this.settings.class.container + ' .media-caption', $.proxy(this, 'setMediaAttributes'))
            .on('click', '.medium-insert-embeds-overlay', $.proxy(this, 'selectEmbed'))
            .on('contextmenu', '.' + this.settings.class.placeholder, $.proxy(this, 'fixRightClickOnPlaceholder'));

        if (this.settings.parseOnPaste) {
            this.$el
                .on('paste', $.proxy(this, 'processPasted'));
        }

        $(window)
            .on('resize', $.proxy(this, 'autoRepositionToolbars'));
    };


    Embeds.prototype.initCaptions = function () {
        var placeholder = this.settings.captionPlaceholder;

        this.$el.find('.' + this.settings.class.container).each(function () {
            var $this = $(this),
                text = $this.find('figcaption').text();

            if (text) {
                $this.append(window.templates.caption(placeholder));
                $this.find('.media-caption').val(text);
            }

            $this.attr('data-caption', text);
            $this.find('figcaption').remove();
        });

        // Autosize for caption textareas
        autosize($('.media-caption'));
    };

    Embeds.prototype.setMediaAttributes = function () {
        $('.' + this.settings.class.container).each(function () {
            var $media = $(this),
                caption = $media.find('textarea').val();

            $media.attr('data-caption', caption);
        });
    };

    /**
     * Extend editor's serialize function
     *
     * @return {object} Serialized data
     */

    Embeds.prototype.editorSerialize = function () {
        var data = this._serializePreEmbeds();

        $.each(data, function (key) {
            var $data = $('<div />').html(data[key].value);

            $data.find('.medium-insert-embeds-overlay').remove();

            data[key].value = $data.html();
        });

        return data;
    };

    /**
     * Add embedded element
     *
     * @return {void}
     */
    Embeds.prototype.add = function () {
        var $place = this.$el.find('.medium-insert-active');

        // Fix #132
        // Make sure that the content of the paragraph is empty and <br> is wrapped in <p></p> to avoid Firefox problems
        $place.html(window.templates.line);

        // Replace paragraph with div to prevent #124 issue with pasting in Chrome,
        // because medium editor wraps inserted content into paragraph and paragraphs can't be nested
        if ($place.is('p')) {
            $place.replaceWith('<div class="medium-insert-active">' + $place.html() + '</div>');
            $place = this.$el.find('.medium-insert-active');
            this.core.moveCaret($place);
        }

        $place.addClass('medium-insert-embeds medium-insert-embeds-input medium-insert-embeds-active');

        this.togglePlaceholder({ target: $place.get(0) });

        $place.click();
        this.core.hideButtons();
    };

    /**
     * Toggles placeholder
     *
     * @param {Event} e
     * @return {void}
     */
    Embeds.prototype.togglePlaceholder = function (e) {
        var $place = $(e.target),
            selection = window.getSelection(),
            range, $current, text;

        if (!selection || selection.rangeCount === 0) {
            return;
        }

        range = selection.getRangeAt(0);
        $current = $(range.commonAncestorContainer);

        if ($current.hasClass(this.settings.class.active)) {
            $place = $current;
        } else
        if ($current.closest('.' + this.settings.class.active).length) {
            $place = $current.closest('.' + this.settings.class.active);
        }

        if ($place.hasClass(this.settings.class.active)) {

            text = $place.text().trim();

            if (text === '' && $place.hasClass(this.settings.class.placeholder) === false) {
                $place
                    .addClass(this.settings.class.placeholder)
                    .attr('data-placeholder', this.settings.placeholder);
            } else
            if (text !== '' && $place.hasClass(this.settings.class.placeholder)) {
                $place
                    .removeClass(this.settings.class.placeholder)
                    .removeAttr('data-placeholder');
            }

        } else {
            this.$el.find('.' + this.settings.class.active).remove();
        }
    };

    /**
     * Right click on placeholder in Chrome selects whole line. Fix this by placing caret at the end of line
     *
     * @param {Event} e
     * @return {void}
     */

    Embeds.prototype.fixRightClickOnPlaceholder = function (e) {
        this.core.moveCaret($(e.target));
    };

    /**
     * Process link
     *
     * @param {Event} e
     * @return {void}
     */

    Embeds.prototype.processLink = function (e) {
        var $place = this.$el.find('.' + this.settings.class.active),
            url;

        if (!$place.length) {
            return;
        }

        url = $place.text().trim();

        // Return empty placeholder on backspace, delete or enter
        if (url === '' && [8, 46, 13].indexOf(e.which) !== -1) {
            $place.remove();
            return;
        }

        if (e.which === 13) {
            e.preventDefault();
            e.stopPropagation();

            if (this.settings.oembedProxy) {
                this.oembed(url);
            } else {
                this.parseUrl(url);
            }
        }
    };

    /**
     * Process Pasted
     *
     * @param {Event} e
     * @return {void}
     */

    Embeds.prototype.processPasted = function (e) {
        var pastedUrl, linkRegEx;
        if ($('.' + this.settings.class.active).length) {
            return;
        }

        pastedUrl = e.originalEvent.clipboardData.getData('text');
        linkRegEx = new RegExp('^(http(s?):)?\/\/','i');
        if (linkRegEx.test(pastedUrl)) {
            if (this.settings.oembedProxy) {
                this.oembed(pastedUrl, true);
            } else {
                this.parseUrl(pastedUrl, true);
            }
        }
    };

    /**
     * Get HTML via oEmbed proxy
     *
     * @param {string} url
     * @return {void}
     */

    Embeds.prototype.oembed = function (url, pasted) {
        var that = this;

        $.support.cors = true;

        $.ajax({
            crossDomain: true,
            cache: false,
            url: this.settings.oembedProxy,
            dataType: 'json',
            data: {
                url: url
            },
            success: function (data) {
                var html = data && data.html;

                if (that.settings.storeMeta) {
                    html += '<div class="medium-insert-embeds-meta"><script type="text/json">' + JSON.stringify(data) + '</script></div>';
                }

                if (data && !html && data.type === 'photo' && data.url) {
                    html = '<img src="' + data.url + '" alt="">';
                }

                if (!html) {
                    // Prevent render empty embed.
                    $.proxy(that, 'convertBadEmbed', url)();
                    return;
                }

                if (pasted) {
                    $.proxy(that, 'embed', html, url)();
                } else {
                    $.proxy(that, 'embed', html)();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var responseJSON = (function () {
                    try {
                        return JSON.parse(jqXHR.responseText);
                    } catch (e) { }
                })();

                if (typeof window.console !== 'undefined') {
                    window.console.log((responseJSON && responseJSON.error) || jqXHR.status || errorThrown.message);
                } else {
                    window.alert('Error requesting media from ' + that.settings.oembedProxy + ' to insert: ' + errorThrown + ' (response status: ' + jqXHR.status + ')');
                }

                $.proxy(that, 'convertBadEmbed', url)();
            }
        });
    };

    /**
     * Get HTML using regexp
     *
     * @param {string} url
     * @param {bool} pasted
     * @return {void}
     */

    Embeds.prototype.parseUrl = function (url, pasted) {
        var html;

        if (!(new RegExp(['youtube', 'youtu.be', 'vimeo', 'instagram', 'twitter', 'facebook'].join('|')).test(url))) {
            $.proxy(this, 'convertBadEmbed', url)();
            return false;
        }

        html = url.replace(/\n?/g, '')
            .replace(/^((http(s)?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|v\/)?)([a-zA-Z0-9\-_]+)(.*)?$/, '<div class="video video-youtube"><iframe width="420" height="315" src="//www.youtube.com/embed/$7" frameborder="0" allowfullscreen></iframe></div>')
            .replace(/^https?:\/\/vimeo\.com(\/.+)?\/([0-9]+)$/, '<div class="video video-vimeo"><iframe src="//player.vimeo.com/video/$2" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')
            .replace(/^https:\/\/twitter\.com\/(\w+)\/status\/(\d+)\/?$/, '<blockquote class="twitter-tweet" align="center" lang="en"><a href="https://twitter.com/$1/statuses/$2"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>')
            .replace(/^(https:\/\/www\.facebook\.com\/(.*))$/, '<script src="//connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v2.2" async></script><div class="fb-post" data-href="$1"><div class="fb-xfbml-parse-ignore"><a href="$1">Loading Facebook post...</a></div></div>')
            .replace(/^https?:\/\/instagram\.com\/p\/(.+)\/?$/, '<span class="instagram"><iframe src="//instagram.com/p/$1/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe></span>');

        if (this.settings.storeMeta) {
            html += '<div class="medium-insert-embeds-meta"><script type="text/json">' + JSON.stringify({}) + '</script></div>';
        }

        if ((/<("[^"]*"|'[^']*'|[^'">])*>/).test(html) === false) {
            $.proxy(this, 'convertBadEmbed', url)();
            return false;
        }

        if (pasted) {
            this.embed(html, url);
        } else {
            this.embed(html);
        }
    };

    /**
     * Add html to page
     *
     * @param {string} html
     * @param {string} pastedUrl
     * @return {void}
     */

    Embeds.prototype.embed = function (html, pastedUrl) {
        var $place = this.$el.find('.' + this.settings.class.active),
            $div;

        if (!html) {
            alert('Incorrect URL format specified');
            return false;
        } else {
            if (html.indexOf('</script>') > -1) {
                // Store embed code with <script> tag inside wrapper attribute value.
                // Make nice attribute value escaping using jQuery.
                $div = $('<div>')
                    .attr('data-embed-code', $('<div />').text(html).html())
                    .html(html);
                html = $('<div>').append($div).html();
            }

            if (pastedUrl) {
                // Get the element with the pasted url
                // place the embed template and remove the pasted text
                $place = this.$el.find(":not(iframe, script, style)")
                    .contents().filter(
                        function () {
                            return this.nodeType === 3 && this.textContent.indexOf(pastedUrl) > -1;
                        }).parent();

                $place.after(window.templates.embedsWrapper(html));
                $place.text($place.text().replace(pastedUrl, ''));
            } else {
                $place.after(window.templates.embedsWrapper(html));
                $place.remove();
            }


            this.core.triggerInput();

            if (html.indexOf('facebook') !== -1) {
                if (typeof (FB) !== 'undefined') {
                    setTimeout(function () {
                        FB.XFBML.parse();
                    }, 2000);
                }
            }
        }
    };

    /**
     * Convert bad oEmbed content to an actual line.
     * Instead of displaying the error message we convert the bad embed
     *
     * @param {string} content Bad content
     *
     * @return {void}
     */
    Embeds.prototype.convertBadEmbed = function (content) {
        var $place, $empty, $content,
            emptyTemplate = window.templates.line;

        $place = this.$el.find('.' + this.settings.class.active);

        // convert embed node to an empty node and insert the bad embed inside
        $content = $(emptyTemplate);
        $place.before($content);
        $place.remove();
        $content.html(content);

        // add an new empty node right after to simulate Enter press
        $empty = $(emptyTemplate);
        $content.after($empty);

        this.core.triggerInput();

        this.core.moveCaret($empty);
    };

    /**
     * Hide medium insert embeds toolbar and caption
     *
     * @returns {void}
     */
    Embeds.prototype.hideToolbarAndCaption = function () {
        $(this.settings.selector.toolbar + ', ' + this.settings.selector.toolbar2).remove();
        this.core.removeCaptions();
    };

    /**
     * Select clicked embed
     *
     * @param {Event} e
     * @returns {void}
     */
    Embeds.prototype.selectEmbed = function (e) {
        var that = this,
            $embed;

        $embed = $(e.target).hasClass(this.settings.class.container) ? $(e.target) : $(e.target).closest('.' + this.settings.class.container);

        $embed.addClass('medium-insert-embeds-selected');

        setTimeout(function () {
            that.addToolbar();
            that.core.addCaption($embed, that.settings.captionPlaceholder);
        }, 50);
    };

    /**
     * Unselect selected embed
     *
     * @param {Event} e
     * @returns {void}
     */
    Embeds.prototype.unselectEmbed = function (e) {
        var $el = $(e.target).hasClass('medium-insert-embeds') ? $(e.target) : $(e.target).closest('.medium-insert-embeds'),
            $embed = this.$el.find('.medium-insert-embeds-selected');

        if ($el.hasClass('medium-insert-embeds-selected')) {
            $embed.not($el).removeClass('medium-insert-embeds-selected');
            $(this.settings.selector.toolbar + ', ' + this.settings.selector.toolbar2).remove();
            this.core.removeCaptions($el.find('.media-caption'));

            if ($(e.target).hasClass('media-caption')) {
                $el.removeClass('medium-insert-embeds-selected');
            }
            return;
        }

        $embed.removeClass('medium-insert-embeds-selected');
        $(this.settings.selector.toolbar + ', ' + this.settings.selector.toolbar2).remove();

        if ($(e.target).hasClass('media-caption') === false) {
            this.core.removeCaptions();
        }
    };

    /**
     * Remove embed
     *
     * @param {Event} e
     * @returns {void}
     */

    Embeds.prototype.removeEmbed = function (e) {
        var $embed, $empty;

        if (e.which === 8 || e.which === 46) {
            $embed = this.$el.find('.medium-insert-embeds-selected');

            if ($embed.length) {
                e.preventDefault();

                $(this.settings.selector.toolbar + ', ' + this.settings.selector.toolbar2).remove();

                $empty = $(window.templates.line);
                $embed.before($empty);
                $embed.remove();

                // Hide addons
                this.core.hideAddons();

                this.core.moveCaret($empty);
                this.core.triggerInput();
            }
        }
    };

    /**
     * Check if given style is allowed based on source
     *
     * @param {string} src
     * @param {object} style
     * @returns {boolean}
     */

    Embeds.prototype.isAllowedStyle = function (src, style) {
        if (!style.except) {
            return true;
        }

        for (var i = 0; i < style.except.length; i++) {
            if (typeof style.except[i] === 'string') {
                if (src.indexOf(style.except[i]) !== -1) {
                    return false;
                }
            } else {
                if (style.except[i].test(src)) {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     * Get only allowed style options for a given embed element
     *
     * @param {jQuery} embed
     * @returns {object}
     */

    Embeds.prototype.filterToolbarStyles = function (embed) {
        var src = embed.find('[data-embed-code]').attr('data-embed-code') ||
                  embed.find('iframe').attr('src'),
            result = {};

        if (!src) {
            return this.settings.styles;
        }

        for (var key in this.settings.styles) {
            if (this.isAllowedStyle(src, this.settings.styles[key])) {
                result[key] = this.settings.styles[key];
            }
        }

        return result;
    };

    /**
     * Adds embed toolbar to editor
     *
     * @returns {void}
     */

    Embeds.prototype.addToolbar = function () {
        var $embed = this.$el.find('.medium-insert-embeds-selected'),
            active = false,
            $toolbar, $toolbar2, mediumEditor, toolbarContainer, toolbarTemplate;

        if ($embed.length === 0) {
            return;
        }

        mediumEditor = this.core.getEditor();
        toolbarContainer = mediumEditor.options.elementsContainer || 'body';

        toolbarTemplate = window.templates.embedsToolbar(this.filterToolbarStyles($embed));

        if ($(toolbarTemplate).find('ul > li').length <= 1) {
            return;
        }

        $(toolbarContainer).append(toolbarTemplate);

        $toolbar = $(this.settings.selector.toolbar);
        $toolbar2 = $(this.settings.selector.toolbar2);

        $toolbar.find('button').each(function () {
            if ($embed.hasClass('medium-insert-embeds-' + $(this).data('action'))) {
                $(this).addClass('medium-editor-button-active');
                active = true;
            }
        });

        if (active === false) {
            $toolbar.find('button:eq(2)').addClass('medium-editor-button-active');
        }

        this.repositionToolbars();
        $toolbar.fadeIn();
        $toolbar2.fadeIn();
    };

    Embeds.prototype.autoRepositionToolbars = function () {
        setTimeout(function () {
            this.repositionToolbars();
            this.repositionToolbars();
        }.bind(this), 0);
    };

    Embeds.prototype.repositionToolbars = function () {
        var $toolbar = $(this.settings.selector.toolbar),
            $toolbar2 = $(this.settings.selector.toolbar2),
            $embed = this.$el.find('.medium-insert-embeds-selected'),
            elementsContainer = this.core.getEditor().options.elementsContainer,
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            elementsContainerBoundary = elementsContainerAbsolute ? elementsContainer.getBoundingClientRect() : null,
            containerWidth = $(window).width(),
            position = {};

        if ($toolbar2.length) {
            position.top = $embed.offset().top + 2; // 2px - distance from a border
            position.left = $embed.offset().left + $embed.width() - $toolbar2.width() - 4; // 4px - distance from a border

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position.left -= elementsContainerBoundary.left;
                containerWidth = $(elementsContainer).width();
            }

            if (position.left + $toolbar2.width() > containerWidth) {
                position.left = containerWidth - $toolbar2.width();
            }

            $toolbar2.css(position);
        }

        if ($toolbar.length) {
            position.left = $embed.offset().left + $embed.width() / 2 - $toolbar.width() / 2;
            position.top = $embed.offset().top - $toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an embed outset, 5px - distance from an embed

            if (elementsContainerAbsolute) {
                position.top += elementsContainer.scrollTop - elementsContainerBoundary.top;
                position.left -= elementsContainerBoundary.left;
            }

            if (position.top < 0) {
                position.top = 0;
            }

            $toolbar.css(position);
        }
    };

    /**
     * Fires toolbar action
     *
     * @param {Event} e
     * @returns {void}
     */

    Embeds.prototype.toolbarAction = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button'),
            $li = $button.closest('li'),
            $ul = $li.closest('ul'),
            $lis = $ul.find('li'),
            $embed = this.$el.find('.medium-insert-embeds-selected'),
            that = this;

        $button.addClass('medium-editor-button-active');
        $li.siblings().find('.medium-editor-button-active').removeClass('medium-editor-button-active');

        $lis.find('button').each(function () {
            var className = 'medium-insert-embeds-' + $(this).data('action');

            if ($(this).hasClass('medium-editor-button-active')) {
                $embed.addClass(className);

                if (that.settings.styles[$(this).data('action')].added) {
                    that.settings.styles[$(this).data('action')].added($embed);
                }
            } else {
                $embed.removeClass(className);

                if (that.settings.styles[$(this).data('action')].removed) {
                    that.settings.styles[$(this).data('action')].removed($embed);
                }
            }
        });

        this.repositionToolbars();
        this.core.hideButtons();
        this.core.triggerInput();
    };


    /** Plugin initialization */

    $.fn[pluginName + addonName] = function (settings) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Embeds(this, settings));
            }
        });
    };

})(jQuery, window, document);
