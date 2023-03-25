; (function ($, window, document, Util, undefined) {

    'use strict';

    var pluginName = 'mediumInsert';
    var addonName = 'Images'; // first char is uppercase

    /**
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} settings - Options to override defaults
     * @return {void}
     */
    function Images(el, settings) {
        var that = this;

        this.el = el;
        this.$el = $(el);
        this.$currentImage = null;
        this.uploadingsTotalActive = 0;
        this.uploadingsTotal = 0;
        this.file = $('<input type="file" accept="image/*" multiple>');
        this.core = this.$el.data('plugin_' + pluginName);

        this.settings = {
            label: '<i class="material-icons">camera_alt</i>',
            captionPlaceholder: 'Type caption for image (optional)',
            class: {
                container: 'medium-insert-images',
                grid: 'medium-insert-images-grid',
                activeImage: 'medium-insert-image-active',
                active: 'medium-insert-active',
                imagePlaceholder: 'medium-insert-image-placeholder'
            },
            selector: {
                image: 'figure',
                toolbar: '.medium-insert-images-toolbar',
                action: '.medium-editor-action'
            },
            fileUploadOptions: { // See https://github.com/blueimp/jQuery-File-Upload/wiki/Options
                dataType: 'json',
                url: settings.fileUploadOptions.url,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|webp)$/i,
                dropZone: false
            },
            styles: {
                left: {
                    label: '<span class="editor-image-left"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                right: {
                    label: '<span class="editor-image-right"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                wide: {
                    label: '<span class="editor-image-wide"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                full: {
                    label: '<span class="editor-image-crop"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                },
                cropped: {
                    label: '<span class="editor-image-fullpage"></span>'
                    // added: function ($el) {},
                    // removed: function ($el) {}
                }
            },
            messages: {
                acceptFileTypesError: 'This file is not in a supported format: ',
                maxFileSizeError: 'This file is too big: '
            }
        };
        this._name = pluginName;

        // FileUploads
        this.settings.fileUploadOptions.change = function (e, data) {
            that.uploadBefore(e, data);
        };
        this.settings.fileUploadOptions.add = function (e, data) {
            that.uploadAdd(e, data);
        };
        this.settings.fileUploadOptions.done = function (e, data) {
            that.uploadDone(e, data);
        };

        // Extend editor's functions
        if (this.core.getEditor()) {
            this.core.getEditor()._serializePreImages = this.core.getEditor().serialize;
        }

        this.initCaptions();
        this.events();
    }

    Images.prototype.initCaptions = function () {
        var placeholder = this.settings.captionPlaceholder;

        this.$el.find('.' + this.settings.class.container).each(function () {
            var $this = $(this),
                text = $this.find('figcaption').text() || $this.find('img').attr('alt');

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

    /**
     * @return {void}
     */
    Images.prototype.events = function () {
        $(document)
            .on('click', $.proxy(this, 'unselectImage'))
            .on('keydown', $.proxy(this, 'removeImage'))
            .on('click', this.settings.selector.toolbar + ' ' + this.settings.selector.action, $.proxy(this, 'toolbarAction'))
            .on('dragstart', $.proxy(this, 'hideToolbarAndCaption'));

        this.$el
            .on('keydown keyup keypress', '.medium-insert-images .media-caption', $.proxy(this, 'setMediaAttributes'))
            .on('click', '.medium-insert-images img', $.proxy(this, 'selectImage'));

        $(window)
            .on('resize', $.proxy(this, 'autoRepositionToolbars'));
    };

    Images.prototype.setMediaAttributes = function () {
        $('.' + this.settings.class.container).each(function () {
            var $media = $(this),
                $img = $media.find('img'),
                caption = $media.find('textarea').val();

            $media.attr('data-caption', caption);
            $img.attr('alt', caption);
        });
    };

    /**
     * Invoke file selection dialog
     *
     * @return {void}
     */
    Images.prototype.add = function () {
        this.method = 'append';
        this.file.fileupload(this.settings.fileUploadOptions);
        this.file.click();
    };

    /**
     * Add provided files to upload queue
     *
     * @param {object} data
     * @param {string} method
     * @return {void}
     */
    Images.prototype.drop = function (data, method) {
        this.method = method;

        this.uploadBefore(null, data);
        this.file.fileupload(this.settings.fileUploadOptions);
        this.file.fileupload('add', { files: data.files });
    };

    /**
     * Invoked when one or more files were selected in file dialog
     *
     * @param {Event} e
     * @param {object} data
     * @return {void}
     */
    Images.prototype.uploadBefore = function (e, data) {
        this.uploadingsTotalActive = 0;
        this.uploadingsTotal = data.files.length;
        this.prepareContainer();
        dispatchNewEvent('editorImagesUploadingStarted');
    };

    /**
     * Prepare a container for future images
     *
     * @returns {void}
     */
    Images.prototype.prepareContainer = function () {
        var $place = this.$el.find('.' + this.settings.class.active),
            template = templates.images(this.settings.class.container, '');

        if ($place.is(this.settings.selector.image)) {
            this.$place = $place;
        } else {
            this.$place = $(template);
            $place.replaceWith(this.$place);
        }
    };

    /**
     * Callback invoked as soon as files are added to the fileupload widget - via file input selection, drag & drop or add API call.
     * https://github.com/blueimp/jQuery-File-Upload/wiki/Options#add
     *
     * @param {Event} e
     * @param {object} data
     * @return {void}
     */
    Images.prototype.uploadAdd = function (e, data) {
        var that = this,
            errors = 0,
            file = data.files[0],
            acceptFileTypes = this.settings.fileUploadOptions.acceptFileTypes,
            maxFileSize = this.settings.fileUploadOptions.maxFileSize,
            reader;

        if (acceptFileTypes && !acceptFileTypes.test(file.type)) {
            errors++;
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: this.settings.messages.acceptFileTypesError + file.name
            });
        } else if (maxFileSize && file.size > maxFileSize) {
            errors++;
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: this.settings.messages.maxFileSizeError + file.name
            });
        }

        if (errors == 0) {
            this.core.hideButtons();

            if (data.autoUpload || (data.autoUpload !== false && $(e.target).fileupload('option', 'autoUpload'))) {
                this.prepareImagePlaceholder(data);
                data.process().done(function () {
                    reader = new FileReader();
                    reader.onload = function (e) {
                        $.proxy(that, 'prepareImage', e.target.result, data)();
                    };
                    reader.readAsDataURL(data.files[0]);
                });
            }
        } else {
            dispatchNewEvent('editorImagesUploadingError');
        }

        this.file.val(null);
    };

    /**
     * Create an image placeholder
     *
     * @param {object} data
     * @returns {void}
     */
    Images.prototype.prepareImagePlaceholder = function (data) {
        var template = templates.image('', data.files[0].name),
            $image = $(template).addClass(this.settings.class.imagePlaceholder);

        switch (this.method) {
            case 'append':
                this.$place.append($image);
                break;
            case 'before':
                this.$place.before($image);
                break;
            case 'after':
                this.$place.after($image);
                this.$place = $image;
                break;
        }

        data.context = $image;
    };

    /**
     * Display image and initiate upload
     *
     * @param {string} img
     * @param {object} data
     * @returns {void}
     */
    Images.prototype.prepareImage = function (img, data) {
        data.context
            .removeClass(this.settings.class.imagePlaceholder)
            .find('img')
            .attr('src', img);

        data.submit();

        this.uploadingsTotalActive++;

        if (this.uploadingsTotalActive === this.uploadingsTotal) {
            var that = this,
                editor = $(this.core.getEditor().elements);

            setTimeout(function () {
                editor.mediaComposer('updateMedia');
                that.core.triggerInput();
            })
        }
    };

    /**
     * Callback for successful upload requests.
     * https://github.com/blueimp/jQuery-File-Upload/wiki/Options#done
     *
     * @param {Event} e
     * @param {object} data
     * @return {void}
     */
    Images.prototype.uploadDone = function (e, data) {
        var $placeholder = this
            .$el
            .find('.' + this.settings.class.container + ' > ' + this.settings.selector.image)
            .filter("[data-image='"+data.result.source+"']");
        var $img = $placeholder.find('img');

        console.log(data.result);
        
        $img.attr('src', data.result.url);
        $placeholder.removeAttr('data-image');
        this.uploadingsTotalActive--;

        if (this.uploadingsTotalActive == 0) {
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: "Media uploaded"
            });
            // Display buttons
            this.core.positionButtons();

            $(this.core.getEditor().elements).mediaComposer('updateMedia');
            dispatchNewEvent('editorImagesUploadingSuccess');
        }
    };

    /**
     * Count selected images
     *
     * @retunrs {number}
     */
    Images.prototype.countSelected = function () {
        return $('.' + this.settings.class.activeImage).length;
    };

    /**
     * Show/hide medium insert images toolbar and caption
     *
     * @returns {void}
     */
    Images.prototype.updateToolbarAndCaption = function () {
        var that = this;

        setTimeout(function () {
            var image;

            if (that.countSelected() === 1) {
                image = $('.' + that.settings.class.activeImage);

                $(that.settings.selector.toolbar).remove();
                that.addToolbar();
                that.core.addCaption(image.closest(that.settings.selector.image).parent(), that.settings.captionPlaceholder);
            } else {
                that.hideToolbarAndCaption();
            }
        }, 50);
    };

    /**
     * Hide medium insert images toolbar and caption
     *
     * @returns {void}
     */
    Images.prototype.hideToolbarAndCaption = function () {
        $(this.settings.selector.toolbar).remove();
        this.core.removeCaptions();
    };

    /**
     * @param {Event} e
     * @returns {void}
     */
    Images.prototype.selectImage = function (e) {
        var image,
            $wrapper,
            multi = e.shiftKey || e.ctrlKey || e.metaKey;

        image = this.$currentImage = $(e.target);
        $wrapper = image.closest('.' + this.settings.class.container);

        // Hide keyboard on mobile devices
        this.$el.blur();

        if (multi) {
            image.toggleClass(this.settings.class.activeImage);
            if ($wrapper.find('.' + this.settings.class.activeImage).length > 0) {
                $wrapper.addClass(this.settings.class.active);
            } else {
                $wrapper.removeClass(this.settings.class.active);
            }
        } else {
            image.addClass(this.settings.class.activeImage);
            $wrapper.addClass(this.settings.class.active);
        }

        this.updateToolbarAndCaption();
    };

    /**
     * @param {Event} e
     * @returns {void}
     */
    Images.prototype.unselectImage = function (e) {
        var $el = $(e.target),
            $image = this.$el.find('.' + this.settings.class.activeImage),
            multi = e.shiftKey || e.ctrlKey || e.metaKey;

        if (multi) {
            return;
        }

        if ($el.is('img') && $el.hasClass(this.settings.class.activeImage)) {
            $image.not($el).removeClass(this.settings.class.activeImage);
            this.updateToolbarAndCaption();
            return;
        }

        $image.removeClass(this.settings.class.activeImage);
        $(this.settings.selector.toolbar).remove();

        if ($el.hasClass('media-caption') === false) {
            this.core.removeCaptions();
        }

        this.$currentImage = null;
    };

    /**
     * @param {Event} e
     * @returns {void}
     */
    Images.prototype.removeImage = function (e) {
        if (e.target.nodeName === "TEXTAREA") {
            return;
        }

        var $selectedNext,
            images = [],
            imageSelector = this.settings.selector.image,
            $selectedImage = this.$el.find('.' + this.settings.class.activeImage),
            $parent, $empty, selection, range, current, caretPosition, $current, $sibling, selectedHtml, i;

        if (e.which === 8 || e.which === 46) {

            if ($selectedImage.length) {
                images.push($selectedImage);

                if (e.which === 8) {
                    $selectedNext =
                        ( $selectedImage.parent().prev(imageSelector).length &&
                          $selectedImage.parent().prev(imageSelector) ) ||
                        ( $selectedImage.parent().next(imageSelector).length &&
                          $selectedImage.parent().next(imageSelector) );
                } else {
                    $selectedNext =
                        ( $selectedImage.parent().next(imageSelector).length &&
                          $selectedImage.parent().next(imageSelector) ) ||
                        ( $selectedImage.parent().prev(imageSelector).length &&
                          $selectedImage.parent().prev(imageSelector) );
                }

                if ($selectedNext.length) {
                    $selectedNext.find('img').addClass(this.settings.class.activeImage);
                }
            }

            // Remove image if it's not selected, but backspace/del is pressed in text
            selection = window.getSelection();
            if (!$selectedImage.length && selection && selection.rangeCount) {
                range = selection.getRangeAt(0);
                current = range.commonAncestorContainer;
                caretPosition = MediumEditor.selection.getCaretOffsets(current).left;
                $current = $(current);

                if (current.nodeName === '#text' || current.nodeName === 'BR') {
                    $current = $(current).parent();
                }

                // Is backspace pressed and caret is at the beginning of a paragraph, get previous element
                if (e.which === 8 && caretPosition === 0) {
                    $sibling = $current.prev();

                    if ($sibling.hasClass(this.settings.class.container)) {
                        e.preventDefault();

                        if ($sibling.find(imageSelector).length <= 1) {
                            $sibling.remove();
                        } else {
                            $sibling.find(imageSelector).last().remove();
                        }

                        this.$el.mediaComposer('updateMedia');
                        return;
                    }

                // Is del pressed and caret is at the end of a paragraph, get next element
                } else if (e.which === 46 && caretPosition === $current.text().length) {
                    $sibling = $current.next();

                    if ($sibling.hasClass(this.settings.class.container)) {
                        e.preventDefault();

                        if ($sibling.find(imageSelector).length <= 1) {
                            $sibling.remove();
                        } else {
                            $sibling.find(imageSelector).first().remove();
                        }

                        this.$el.mediaComposer('updateMedia');
                        return;
                    }
                }

                if ($sibling && $sibling.hasClass(this.settings.class.container)) {
                    images.push($sibling.find('img'));
                }

                // If text is selected, find images in the selection
                selectedHtml = MediumEditor.selection.getSelectionHtml(document);
                if (selectedHtml) {
                    $('<div></div>').html(selectedHtml).find('.' + this.settings.class.container + ' img').each(function () {
                        images.push($(this));
                    });
                }
            }

            if (images.length) {
                for (i = 0; i < images.length; i++) {

                    $parent = images[i].closest('.' + this.settings.class.container);
                    images[i].closest(imageSelector).remove();

                    if ($parent.find(imageSelector).length === 0) {
                        $empty = $parent.next();
                        if ($empty.is('p') === false || $empty.text() !== '') {
                            $empty = $(window.templates.line);
                            $parent.before($empty);
                        }
                        $parent.remove();
                    }
                }

                dispatchNewEvent('editorImageRemoved');

                // Hide addons
                this.core.hideAddons();
                if (!selectedHtml && $empty) {
                    e.preventDefault();
                    this.core.moveCaret($empty);
                }

                $(this.settings.selector.toolbar).remove();
                this.core.triggerInput();
                this.$el.mediaComposer('updateMedia');
            }
        }
    };

    /**
     * @returns {void}
     */
    Images.prototype.addToolbar = function () {
        var $image = this.$el.find('.' + this.settings.class.activeImage),
            $p = $image.closest('.' + this.settings.class.container),
            active = false,
            mediumEditor = this.core.getEditor(),
            toolbarContainer = mediumEditor.options.elementsContainer || 'body',
            $toolbar;

        if ($p.hasClass(this.settings.class.grid)) {
            return;
        }

        $(toolbarContainer).append(window.templates.imagesToolbar(this.settings.styles));

        $toolbar = $(this.settings.selector.toolbar);

        $toolbar.find('button').each(function () {
            if ($p.hasClass('medium-insert-images-' + $(this).data('action'))) {
                $(this).addClass('medium-editor-button-active');
                active = true;
            }
        });

        if (active === false) {
            $toolbar.find('button:eq(2)').addClass('medium-editor-button-active');
        }

        this.repositionToolbars();

        $toolbar.fadeIn();
    };

    Images.prototype.autoRepositionToolbars = function () {
        setTimeout(function () {
            this.repositionToolbars();
        }.bind(this), 0);
    };

    Images.prototype.repositionToolbars = function () {
        var $toolbar = $(this.settings.selector.toolbar),
            $image = this.$el.find('.' + this.settings.class.activeImage),
            elementsContainer = this.core.getEditor().options.elementsContainer,
            elementsContainerAbsolute = ['absolute', 'fixed'].indexOf(window.getComputedStyle(elementsContainer).getPropertyValue('position')) > -1,
            elementsContainerBoundary = elementsContainerAbsolute ? elementsContainer.getBoundingClientRect() : null,
            position = {};


        if ($toolbar.length) {
            position.top = $image.offset().top - $toolbar.height() - 8 - 2 - 5; // 8px - hight of an arrow under toolbar, 2px - height of an image outset, 5px - distance from an image
            position.left = $image.offset().left + $image.width() / 2 - $toolbar.width() / 2;

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
    Images.prototype.toolbarAction = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var that = this,
            $button, $li, $ul, $lis, $p;

        if (this.$currentImage === null) {
            return;
        }

        $button = $(e.target).is('button') ? $(e.target) : $(e.target).closest('button');
        $li = $button.closest('li');
        $ul = $li.closest('ul');
        $lis = $ul.find('li');
        $p = this.$el.find('.' + this.settings.class.active);

        $button.addClass('medium-editor-button-active');
        $li.siblings().find('.medium-editor-button-active').removeClass('medium-editor-button-active');

        $lis.find('button').each(function () {
            var className = 'medium-insert-images-' + $(this).data('action');

            if ($(this).hasClass('medium-editor-button-active')) {
                $p.addClass(className);

                if (that.settings.styles[$(this).data('action')].added) {
                    that.settings.styles[$(this).data('action')].added($p);
                }
            } else {
                $p.removeClass(className);

                if (that.settings.styles[$(this).data('action')].removed) {
                    that.settings.styles[$(this).data('action')].removed($p);
                }
            }
        });

        this.repositionToolbars();
        this.core.hideButtons();
        this.core.triggerInput();
    };

    /**
     * Plugin initialization
     */
    $.fn[pluginName + addonName] = function (settings) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(
                    this,
                    'plugin_' + pluginName + addonName,
                    new Images(this, settings)
                );
            } else if (typeof settings === 'string' && $.data(this, 'plugin_' + pluginName + addonName)[settings]) {
                $.data(this, 'plugin_' + pluginName + addonName)[settings](args[0], args[1]);
            }
        });
    };

})(jQuery, window, document, MediumEditor.util);
