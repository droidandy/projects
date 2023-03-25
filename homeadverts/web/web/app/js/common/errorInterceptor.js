;(function (window, $) {
    'use strict';

    function ErrorInterceptor() {
        this.init();
    }

    ErrorInterceptor.prototype.init = function () {
        $(document).ajaxError(function (event, jqxhr) {
            if (jqxhr.responseText) {
                var json = JSON.parse(jqxhr.responseText);

                if (json.message) {
                    window.snackbar.MaterialSnackbar.showSnackbar({
                        message: json.message
                    });
                }
                if (json.errors) {
                    $.each(json.errors, function (key, message) {
                        window.snackbar.MaterialSnackbar.showSnackbar({
                            message: message
                        });
                    });
                }
            }
        });
    };

    $(document).ready(function () {
        new ErrorInterceptor();
    });

})(window, jQuery);