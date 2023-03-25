;(function (window, $) {
    "use strict";

    $(document).ready(function () {
        var iosChrome = /CriOS/.test(navigator.userAgent);

        if (!iosChrome) {
            return;
        }

        $('html').addClass('--ios-chrome');

        var elementSelectors = [
            '.advertisement .wrapper',
            '.recommended-editorials',
            '.card .background-image',
            '.card .background-image-gradient',
            '#chart'
        ];
        var styleKeys = [
            'height',
            'min-height',
            'max-height'
        ];

        var elements = $(elementSelectors.join(', '));
        elements.each(function (i, element) {
            styleKeys.forEach(function (key) {
                element.style.setProperty(key, $(element).css(key), 'important');
            });
        });
    });

})(window, jQuery);
