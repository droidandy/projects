;(function (window, $) {

    $(document).ready(function () {
        // Property listing =================================
        $('.property-listing').on('click', '.information', function (e) {
            var propertyId = $(this).closest('.property-list-item').attr("data-property-id");
            var href = window.location.href.split('#')[0]+"#property-"+propertyId;

            history.pushState({}, propertyId, href);
        });

        // Property price on details =================================
        var propertyPrice = $('.property-price');
        var originalPrice = $('.original-price');
        var selectedPrice = $('.selected-currency-price');

        function makeOriginalPriceVisible(){
            selectedPrice.removeClass('--visible');
            originalPrice.addClass('--visible');
        }
        function makeSelectedPriceVisible(){
            selectedPrice.addClass('--visible');
            originalPrice.removeClass('--visible');
        }

        if (originalPrice.length ) {
            if (!window.isMobile) {
                propertyPrice.on('mouseover', function (e) {
                    makeOriginalPriceVisible();
                });
                propertyPrice.on('mouseout', function (e) {
                    makeSelectedPriceVisible();
                });
            } else {
                propertyPrice.on('click', function (e) {
                    if (selectedPrice.hasClass('--visible')) {
                        makeOriginalPriceVisible();
                    } else {
                        makeSelectedPriceVisible();
                    }
                });
            }
        }
    });

})(window, jQuery);
