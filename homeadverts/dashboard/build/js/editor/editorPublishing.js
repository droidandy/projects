;(function (window, $) {
    "use strict";

    function EditorPublishing(className) {
        this.writeStory = $(className);

        if (!this.writeStory.length) {
            return;
        }

        this.actions = {
            token: this.writeStory.attr('data-token'),
            read: this.writeStory.attr('data-get-url'),
            edit: this.writeStory.attr('data-put-url'),
            analyze: this.writeStory.attr('data-analyze-url'),
            publish: this.writeStory.attr('data-post-url'),
            primaryMediaUrl: this.writeStory.attr('data-primary-media-url'),
            publishButton: $('.publish-article button')
        };
        this.meta = {
            facebook: Boolean(this.writeStory.attr('data-facebook')),
            twitter: Boolean(this.writeStory.attr('data-twitter')),
            linkedin: Boolean(this.writeStory.attr('data-linkedin'))
        };

        this.socialPublishButton = $('.social-publish button');
        this.status = $('.story-status');
        this.showSidenavButton = $('.action .--publish');
        this.loadingSpinner = $('#uploading-spinner');
        this.tagsSection = $('.section-tags');

        this.xhrCall = false;
        this.xhrCallIsBlocked = false;

        this.initTopic();
        this.bindEditorEvents();
        this.bindControlEvents();
    }

    EditorPublishing.prototype.bindEditorEvents = function () {
        var _this = this;

        // Handling image uploading events
        window.addEventListener('editorImagesUploadingStarted', function () {
            _this.loadingSpinner.addClass('is-active');
            _this.xhrCallIsBlocked = true;
        }, false);
        window.addEventListener('editorImagesUploadingError', function () {
            _this.loadingSpinner.removeClass('is-active');
            _this.xhrCallIsBlocked = false;
        }, false);
        window.addEventListener('editorImagesUploadingSuccess', function () {
            _this.loadingSpinner.removeClass('is-active');
            _this.xhrCallIsBlocked = false;
        }, false);

        window.addEventListener('editorSave', function () {
            _this.save();
        }, false);
    };

    EditorPublishing.prototype.bindControlEvents = function () {
        var _this = this;

        this.actions.publishButton.click(function () {
            _this.publish();
        });
        this.showSidenavButton.click(function () {
           _this.analyze();
        });

        this.socialPublishButton.click(function () {
            var el = $(this);
            var name = el.attr('data-social');

            // Posting on Facebook through API was disabled by the side of Facebook :(
            if (name !== 'facebook') {
                el.toggleClass('--connected');

                _this.meta[name] = el.hasClass('--connected');
                _this.save();
            }
        });
    };

    EditorPublishing.prototype.save = function () {
        var _this = this;

        // Cancel if "mediumInsert" is not yet finished with uploading.
        if (this.xhrCallIsBlocked) {
            return;
        }

        setTimeout(function () {
            if (_this.xhrCall) {
                _this.xhrCall.abort();
                _this.xhrCall = null;
            }
            var topicId = _this.topicSelectize.getValue();

            var payload = {
                token: _this.actions.token,
                title: window.Editor.getTitle(),
                body: window.Editor.getText(),
                metadata: _this.meta
            };

            if (topicId) {
                payload.topic = {
                    id: topicId
                };
            }

            if (payload.body) {
                _this.status.addClass('--saving');
                _this.xhrCall = $.ajax({
                    url: _this.actions.edit,
                    method: "PUT",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    success: function (res, status, xhr) {
                        _this.xhrCall = null;
                        _this.status.removeClass('--saving');
                    },
                    error: function () {
                        _this.xhrCall = null;
                        _this.status.removeClass('--saving');
                    },
                    cache: false
                });
            }
        }, 1000);
    };


    EditorPublishing.prototype.initTopic = function () {
        var _this = this;

        var $select = $('#editor-topic').selectize({
            sortField: 'title',
            onChange: function () {
                _this.save();
            }
        });

        this.topicSelectize = $select[0].selectize;
    };

    EditorPublishing.prototype.publish = function () {
        var _this = this;
        var imagesTotal = $('.medium-insert-images img').length;

        if (imagesTotal === 0) {
            window.snackbar.MaterialSnackbar.showSnackbar({
                message: "For publishing purposes, you need to upload at least one image for the story."
            });

            return false;
        }

        _this.actions.publishButton.attr('disabled', true);

        this.xhrCall = $.ajax({
            url: this.actions.publish,
            method: "POST",
            contentType: "application/json",
            success: function () {
                _this.xhrCall = null;
                _this.status.addClass('--publishing');

                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "The story was published on your account"
                });
                window.location.href = _this.actions.read;
            },
            error: function () {
                _this.xhrCall = null;
            }
        });
    };

    EditorPublishing.prototype.analyze = function () {
        var _this = this;

        if (window.tagAutocomplete.tagsAssigned.length) {
            this.actions.publishButton.removeAttr('disabled');
            this.tagsSection.removeClass('--loading');
        } else {
            this.xhrCall = $.ajax({
                url: this.actions.analyze,
                method: "GET",
                contentType: "application/json",
                success: function (tags, status, xhr) {
                    _this.xhrCall = null;
                    _this.actions.publishButton.removeAttr('disabled');
                    _this.tagsSection.removeClass('--loading');

                    window.tagAutocomplete.addOptions(tags);
                    window.tagAutocomplete.setValues(tags);
                },
                error: function () {
                    _this.xhrCall = null;
                    _this.actions.publishButton.removeAttr('disabled');
                    _this.tagsSection.removeClass('--loading');
                }
            });
        }
    };

    EditorPublishing.prototype.setTags = function (suggestedTags) {
        console.log(suggestedTags);
    };

    $(document).ready(function () {
        new EditorPublishing('.write-story');
    });

})(window, jQuery);
