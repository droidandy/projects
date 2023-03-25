;(function (window, $) {
    "use strict";

    function ArticleWriterActions(button) {
        this.button = button;

        if (!this.button.length) {
            return;
        }

        this.deleteItem = this.button.find('.action-delete');
        this.button.addClass('is-edit-upgraded');

        this.bindEvents();
    }

    ArticleWriterActions.prototype.bindEvents = function () {
        var _this = this;

        this.deleteItem.click(function (e) {
            e.preventDefault();
            _this.delete($(this).attr('href'));
        });
    };

    ArticleWriterActions.prototype.delete = function (url) {
        $.ajax({
            url: url,
            method: "DELETE",
            contentType: "application/json",
            success: function (res, status, xhr) {
                if (xhr.status == 200) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: "The story has been deleted."
                    });

                    setTimeout(function () {
                        window.location.reload(false);
                    }, 500)
                }
            }
        });
    };

    var boot = function () {
        var buttons = $('.edit-actions:not(.is-edit-upgraded)');

        if (buttons.length) {
            buttons.map(function (i, button) {
                new ArticleWriterActions($(button));
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
