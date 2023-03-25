;(function (window, $) {
    "use strict";

    function Editor(className) {
        this.className = className;
        this.editorElement = $(this.className);

        if (!this.editorElement.length) {
            return;
        }

        this.actions = {
            uploadFile: this.editorElement.attr('data-upload-file-url'),
            deleteFile: this.editorElement.attr('data-delete-file-url')
        };
        this.storyTitleLabel = $('.story-title label');
        this.wordsCount = $('.meta-summary .words span');

        this.settings = window.editorSettings; // shortcut
        this.mediumEditor = null;
        this.storyTitleInput = $('.story-title #story-title');

        this.initEditor();

        this.bindEvents();
        this.bindSaveEvents();
        this.blockKeyboardEvents();
        this.toggleTitleLabelVisibility();
        this.displayWordsCount();
        this.toggleToolbar();
    }

    Editor.prototype.getTitle = function () {
        return this.storyTitleInput.val() || "Empty title";
    };

    Editor.prototype.getText = function () {
        var data = this.mediumEditor.serialize();

        return data['element-0']['value'];
    };

    Editor.prototype.initEditor = function () {
        this.mediumEditor = new MediumEditor(
            this.className,
            this.settings.editor
        );

        this.editorElement.mediumInsert(this.settings, this);
        this.editorElement.dragAndDrop(this.settings);
        this.editorElement.dropUpload(this.settings);
        this.editorElement.mediaComposer(this.settings);

        // Autosize for title
        autosize(this.storyTitleInput);
    };

    Editor.prototype.bindEvents = function () {
        var _this = this;

        window.addEventListener('resize', function () {
            _this.toggleToolbar();
        }, false);
    };

    Editor.prototype.bindSaveEvents = function () {
        var _this = this;

        window.addEventListener('editorImagesUploadingSuccess', function () {
            dispatchNewEvent('editorSave');
        }, false);

        this.mediumEditor.subscribe('editableInput', function () {
            dispatchNewEvent('editorSave');
            _this.displayWordsCount();
        });

        this.storyTitleInput.keyup(function () {
            _this.toggleTitleLabelVisibility();
            dispatchNewEvent('editorSave');
        });
    };

    Editor.prototype.blockKeyboardEvents = function () {
        $(window).keydown(function (event) {
            if (event.target.id == 'story-title') {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            }
        });
    };

    Editor.prototype.toggleTitleLabelVisibility = function () {
        if (this.storyTitleInput.val()) {
            this.storyTitleLabel.show();
        } else {
            this.storyTitleLabel.hide();
        }
    };

    Editor.prototype.displayWordsCount = function () {
        var serializedData = this.mediumEditor.serialize();
        var s = serializedData['element-0']['value'];
        var count = 0;

        var trimmedText = s
            .replace(/((&nbsp;)|(<[^>]*>))+/g, ' ') // replace html with spaces
            .replace(/\s+/g, ' ') // merge multiple spaces into one
            .trim(); // trim ending and beginning spaces
        var spaces = trimmedText.match(/\s/g); // find all spaces by regex

        if (spaces) {
            count = spaces.length + 1;
        } else if (trimmedText != "") {
            count = 1;
        }

        this.wordsCount.text(count);
    };

    Editor.prototype.toggleToolbar = function () {
        if (window.innerWidth <= this.settings.sizes.tabletWidth &&
            this.mediumEditor.options.toolbar.static === false) {
            this.setStaticToolbar(true);
            this.editorElement.mediumInsert('addToolbarButtons');
        } else
        if (window.innerWidth > this.settings.sizes.tabletWidth &&
            this.mediumEditor.options.toolbar.static === true) {
            this.setStaticToolbar(false);
        }
    };

    Editor.prototype.setStaticToolbar = function (isStatic) {
        this.mediumEditor.options.toolbar.static = isStatic;
        this.mediumEditor.options.toolbar.sticky = isStatic;
        this.mediumEditor.destroy();
        this.mediumEditor.setup();
    };

    $(document).ready(function () {
        autosize($('textarea'));
        window.Editor = new Editor('.editable');
    });

})(window, jQuery);
