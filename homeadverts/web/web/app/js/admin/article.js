;(function (window, $) {
    "use strict";

    function ArticleEditAdminActions(actions) {
        this.button = actions;

        if (!actions.length) {
            return;
        }

        this.url = {
            add: this.button.attr('data-url-tag-remove'),
            remove: this.button.attr('data-url-tag-remove')
        };
        this.tagAction = actions.find('.action-tag');
        this.button.addClass('is-admin-edit-upgraded');

        this.bindEvents();
    }

    ArticleEditAdminActions.prototype.bindEvents = function () {
        var _this = this;

        this.tagAction.click(function (e) {
            e.preventDefault();
            var item = $(e.target);

            if (item.hasClass('material-icons')) {
                item = item.parent('.action-tag');
            }

            _this.toggleTag(item);
        });
    };

    ArticleEditAdminActions.prototype.toggleTag = function (item) {
        var tag = item.attr('data-tag');
        var isChecked = item.hasClass('checked');

        if (isChecked) {
            $.ajax({
                url: this.url.remove,
                method: "DELETE",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    tag: tag
                }),
                success: function (res, status, xhr) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: "You've unmarked the story as "+tag
                    });
                    item.removeClass('checked');
                }
            });
        } else {
            $.ajax({
                url: this.url.add,
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    tag: tag
                }),
                success: function (res, status, xhr) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: "You've marked the story as "+tag
                    });
                    item.addClass('checked');
                }
            });
        }
    };

    var boot = function () {
        var buttons = $('.edit-actions.--admin:not(.is-admin-edit-upgraded)');

        if (buttons.length) {
            buttons.map(function (i, button) {
                new ArticleEditAdminActions($(button));
            });
        }
    };
    $(document).ready(function () {
        boot();
    });
    window.addEventListener('paginationUpdated', function () {
        boot();
    }, false);

})(window, jQuery);
