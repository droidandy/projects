;(function ($) {

    $.easing = $.easing || {};
    $.easing.easeInOutQuad = function (x, t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        } else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };

})(jQuery);
