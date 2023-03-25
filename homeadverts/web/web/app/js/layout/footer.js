;(function (window, $) {
    "use strict";

    function fixLocationsGrid () {
        var locations = $('.footer-nav.--locations .content-desktop').children();
        var rows = 3;

        for (var i = rows; i < locations.length; i++) {
            var column = $(locations[i]),
                columnAbove = $(locations[i - rows]),
                currentMargin = parseInt(column.css('margin-top')),
                newMargin = columnAbove.offset().top + columnAbove.height() - column.offset().top + currentMargin;
            column.css('margin-top', newMargin);
        }
    }

    $(document).ready(function () {
        fixLocationsGrid();
        $(window).on('resize', fixLocationsGrid);
    });
})(window, jQuery);
