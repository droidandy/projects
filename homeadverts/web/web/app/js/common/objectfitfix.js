;(function (window, $) {
    "use strict";

    $(document).ready(function () {
        if(('objectFit' in document.documentElement.style) === false) {
            $('.medium-insert-images-cropped img, .medium-insert-images-grid img').each(function (i, img) {
                $(img).replaceWith(
                    $('<div class="img" style="background-image: url(' + img.src + ')"></div>')
                );
            });
        }
    });

})(window, jQuery);
