;(function ($, window, document, undefined) {

    var pluginName = "lazyloader",
        defaults = {
            container: false,
            react: -800
        };

    // Public methods
    var methods = {
        setUrl: function (url) {
            this.options.url = url;
        },
        setPages: function (pages) {
            this.options.pages = pages;
        }
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._spinner = this._createLoader();
        this._loading = false;
        this.fallbackImage = '/assets/images/coming-soon.jpg';
        this.images = []; //our collection of iamges to check through
        this.checkedImages = []; //previously checked

        this.resetPage();
        this.bindEvents();
        this.init();
    }

    Plugin.prototype.init = function () {
        // Setup event listeners
        $(window).scroll($.proxy(this._isNearBottom, this));
        this._isNearBottom(); // fire it straight away for short pages
    };

    Plugin.prototype.bindEvents = function () {
        var _this = this;

        $(document).on('data-filter-url-changed', function () {
            _this.resetPage();
        });
    };

    Plugin.prototype.resetPage = function () {
        var queryParams = this.getQueryParameters();

        if (queryParams.p === undefined) {
            this._page = 1;
        } else {
            this._page = queryParams.p;
        }
    };

    Plugin.prototype.getQueryParameters = function () {
        var queryDict = {};

        location.search.substr(1).split("&").forEach(function (item) {
            item = decodeURIComponent(item);
            queryDict[item.split("=")[0]] = item.split("=")[1];
        });

        return queryDict;
    };

    Plugin.prototype._createLoader = function () {
        return $('<div class="list-loader"></div>').insertAfter(this.element).hide();
    };

    /*
        Do the actual leg work and get the items from the requested page
     */
    Plugin.prototype._loadItems = function () {
        if (this._isLastPage()) {
            return false;
        }

        this._page++;
        this._spinner.show();
        this._loading = true;
        var _this = this;

        queryParams = this.getQueryParameters();
        queryParams.p = this._page;

        var url = window.location.pathname + '?' + $.param(queryParams);

        if (history.replaceState) {
            history.replaceState({}, window.title, url);
        }

        this.element.trigger('lazyloader.load', {
            page: this._page
        });

        $.ajax({
            url: url,
            method: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Pagination", true);
            },
            success: function (data) {
                var container = _this.element ;
                var $data = $($.parseHTML(data));

                if (_this.options.container) {
                    container = _this.element.find(_this.options.container);
                }

                // If there's listhub tracking JS we should execute it
                if ($data.find('.listhub-js').length) {
                    eval($data.find('.listhub-js').html());
                }

                container.append($data);

                _this.element.trigger('lazyloader.update', {
                    items: $data,
                    container: _this.options.container
                });
                _this._loading = false;
                _this._spinner.hide();

                dispatchNewEvent('paginationUpdated');
            }
        });
    };

    /*
        If we are on the last page, do nothing
     */
    Plugin.prototype._isLastPage = function () {
        return parseInt(this._page, 10) >= parseInt(this.options.pages, 10);
    };

    /*
        If we are close to the bottom of the page, trigger the events
     */
    Plugin.prototype._isNearBottom = function () {
        if (this._loading) {
            return;
        }

        var scrollPos = parseInt($(window).scrollTop() + $(window).height(), 10),
            bottomBoundry = parseInt(this.element.offset().top + this.element.innerHeight(), 10),
            diff = scrollPos - bottomBoundry;

        if (diff >= this.options.react) {
            this._loadItems();
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        var args = arguments;

        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
            else if (options in methods) {
                var plugin = $.data(this, "plugin_" + pluginName);

                methods[options].apply(plugin, Array.prototype.slice.call(args, 1));
            }
        });
    };

})(jQuery, window, document);
