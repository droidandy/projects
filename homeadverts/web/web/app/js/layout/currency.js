;(function (window, $) {
    'use strict';

    // @todo: to be improved.

    function currencySelection() {
        var el = $('.currency-selector a, .currency-selector .item');

        $(el).on('click', function (e) {

            var url = $('.currency-selector').attr('data-url');
            var currency = $(this).attr('data-currency');

            $.ajax({
                type: 'POST',
                url: url,
                contentType: "application/json",
                data: JSON.stringify({
                    "currency": currency
                }),
                success: function (res, status, xhr) {
                    location.reload();
                }
            });

            e.preventDefault();
        });
    }

    $(document).ready(function () {
        currencySelection();
    });

})(window, jQuery);
