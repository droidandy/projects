;(function (window, $) {
    'use strict';

    function TopicsSelection(className) {
        this.container = $(className);

        if (!this.container.length) {
            return;
        }

        this.updateButton = this.container.find('.update-followings');
        this.topicCheckboxes = this.container.find('[type=checkbox]');
        this.url = this.container.attr('data-url');
        this.closeBtn = $('#sidenav .close');

        this.init();
        this.bindEvents();
    }

    TopicsSelection.prototype.init = function () {
        if (this.container.attr('data-followed-topics-count') == 0) {
            dispatchNewEvent('showTopicSelection');
        }
    };

    TopicsSelection.prototype.bindEvents = function () {
        var _this = this;

        this.topicCheckboxes.on('click', function () {
            _this.toggleButtonAccess();
        });

        this.updateButton.on('click', function () {
            _this.update();
            _this.close();
        });
    };

    TopicsSelection.prototype.toggleButtonAccess = function () {
        var topicIds = this.getSelectedTopicIds();

        if (topicIds.length < 3) {
            this.updateButton.attr('disabled', true);
        } else {
            this.updateButton.removeAttr('disabled');
        }
    };

    TopicsSelection.prototype.update = function () {
        var _this = this;
        var topicIds = this.getSelectedTopicIds();
    
        this.updateButton.attr('disabled', true);
        
        if (topicIds.length >= 3) {
            $.ajax({
                url: this.url,
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    ids: topicIds
                }),
                success: function (res, status, xhr) {
                    _this.container.attr('data-followed-topics-count', topicIds.length);
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: "Your preferences were updated."
                    });
    
                    _this.updateButton.removeAttr('disabled');
                    dispatchNewEvent('closeSideNav');
                },
                error: function () {
                    _this.updateButton.removeAttr('disabled');
                    
                    _this.isBusy = false;
                }
            });
        }
    };

    TopicsSelection.prototype.close = function () {
        this.closeBtn.click();
    };

    /**
     * @returns {Array}
     */
    TopicsSelection.prototype.getSelectedTopicIds = function () {
        var topicIds = [];

        this.topicCheckboxes.each(function () {
            if ($(this).prop('checked')) {
                topicIds.push($(this).attr('data-id'));
            }
        });

        return topicIds;
    };

    $(window).load(function () {
        new TopicsSelection('#tags-to-follow')
    });

})(window, jQuery);
