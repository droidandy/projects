;(function (window, $) {
    "use strict";

    function ArticleImport(className) {
        this.import = $(className);

        if (!this.import.length) {
            return;
        }
        this.url = this.import.attr('data-url');
        this.input = this.import.find('input');
        this.button = this.import.find('button');
        this.spinner = $('#importing-spinner');

        this.init();
        this.bindEvents();
    }

    ArticleImport.prototype.init = function () {
        this.input.focus();
    };

    ArticleImport.prototype.bindEvents = function () {
        var _this = this;

        this.button.click(function (e) {
            e.preventDefault();
            var url = _this.input.val();

            if (url) {
                _this.runImport(url);
            } else {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Link to a story can't be blank"
                });
            }
        });
    };

    ArticleImport.prototype.runImport = function (url) {
        var _this = this;
        this.button.attr("disabled", "disabled");
        this.spinner.addClass('is-active');

        $.ajax({
            url: _this.url,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                url: url
            }),
            success: function (res, status, xhr) {
                _this.spinner.removeClass('is-active');
                _this.button.removeAttr("disabled");

                window.location.href = xhr.getResponseHeader('Location')+'?with-help=1';
            },
            error: function (xhr, status, errorThrown) {
                // todo: rewrite this part using ErrorInterceptor()

                _this.spinner.removeClass('is-active');
                _this.button.removeAttr("disabled");
            }
        });
    };

    $(document).ready(function () {
        new ArticleImport('#import-article');
    });

})(window, jQuery);
