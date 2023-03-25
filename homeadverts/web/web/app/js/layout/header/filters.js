;(function (window, $) {
    "use strict";

    function CollectionFilters() {
        this.primaryForm = $("#primary-filter").closest('form');
        this.menuForm = $("#sidebar-filters").children('form');
        this.primaryFilters = $('.filters input[type="hidden"]');
        this.menuFilters = $('input.filter-value');

        this.bindEvents();
    }

    CollectionFilters.prototype.bindEvents = function () {
        var _this = this;

        this.primaryFilters.change(function () {
            var filter =$ (this);
            if (filter.closest('.filter').hasClass('filter-currency')) {
                var currency = filter.val();
                $('.filter-price').each(function () {
                    var el = $(this);
                    if (currency === el.data('currency')) {
                        el.show();
                        el.find('input[type="hidden"]').prop('disabled', false);
                    } else {
                        el.hide();
                        el.find('input[type="hidden"]').prop('disabled', true);
                    }
                });
            }
            _this.onChange(_this.primaryForm);
        });
        this.menuFilters.change(function () {
            var filter = $(this);
            if (filter.hasClass('filter-value-currency')) {
                var currency = filter.val();
                $('.filter-value-price').each(function () {
                    var el = $(this);
                    if (currency === el.data('currency')) {
                        el.closest('.filter-mobile').show();
                        el.prop('disabled', false);
                    } else {
                        el.closest('.filter-mobile').hide();
                        el.prop('disabled', true);
                    }
                });
            }
            _this.onChange(_this.menuForm);
        });
    };

    CollectionFilters.prototype.onChange = function (form) {
        var url = form.attr('action');
        var filters = form.serialize().replace(/[^&]+=\.?(?:&|$)/g, '');

        //so we dont have to wait until the filters
        //response to act in other parts of the site
        $(document).trigger('data-filter-changed');
        this.showPreloader();

        if ($('.agent-listing').length || $('.blog').length) {
            url = form.attr('action') + "?" + filters;

            $.get(url).done(this.processResponse);
        } else {
            $.post(url, filters).done(this.processResponse);
        }
    };

    CollectionFilters.prototype.showPreloader = function () {
        $('.list').children().remove();
        $('.list').next('.list-loader').show();
    };

    CollectionFilters.prototype.processResponse = function (response) {
        var heading = $('.items-collection .headline');
        var $data = $($.parseHTML(response));
        var url = $data.find('[data-filter-url]').attr('data-filter-url');
        var items = $data.find('.list > *');
        var $heading = $data.find('.items-collection .headline');

        history.replaceState({}, url, url);
        heading.html($heading.html());
        $('.list').next('.list-loader').hide();

        if (items.length > 0) {
            $('.list').append(items);
        }

        if ($('.list[data-page-total]').data('plugin_lazyloader')) {
            $('.list[data-page-total]').lazyloader('setUrl', url);
            $('.list[data-page-total]').lazyloader('setPages', $data.find('.list').attr('data-page-total'));
        }

        $(document).trigger('data-filter-url-changed');
        dispatchNewEvent('paginationUpdated');
    };

    $(document).ready(function () {
        new CollectionFilters();
    });

})(window, jQuery);
