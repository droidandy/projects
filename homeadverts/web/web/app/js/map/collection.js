;(function (window, $) {
    "use strict";

    function MapCollection(map) {
        MapAbstract.call(this, map);

        this.collectionURL = $('[data-json-target]').attr('data-json-target');
        this.pageContainer = $('.page-container');
        this.switchView = $('.switch-views');

        this.cluster = new MarkerClusterer(this.map, [], {
            imagePath: this.icon,
            gridSize: 40,
            maxZoom: 14,
            zoomOnClick: true,
            averageCenter: true,
            minimumClusterSize: 2,
            ignoreHidden: true,
            styles: [
                {
                    url: this.icon+this.iconExt,
                    textColor: '#fafafa',
                    textSize: 11,
                    height: 40,
                    width:  38
                },
                {
                    url: this.icon+'1'+this.iconExt,
                    textColor: '#fafafa',
                    textSize: 11,
                    height: 40,
                    width:  38
                },
                {
                    url: this.icon+'2'+this.iconExt,
                    textColor: '#fafafa',
                    textSize: 13,
                    height: 60,
                    width:  60
                }
            ]
        });

        this.bindEvents();
        this._setInitialState();
    }

    MapCollection.prototype = Object.create(MapAbstract.prototype);
    MapCollection.prototype.constructor = MapCollection;

    MapCollection.prototype.bindEvents = function () {
        var _this = this;

        $('.button-map').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(document).trigger('collection-map-view-changed');
            $(this).toggleClass('selected');
        });

        $(document).on('collection-map-view-changed', function () {
            if (_this.switchView.hasClass('--collection')) {
                _this._updateQueryState('map', 1);

                _this.pageContainer.addClass('--fixed');
                _this.switchView.removeClass('--collection');
                _this._updateScroll(true);
            } else {
                _this._updateQueryState('map', 0);

                _this.pageContainer.removeClass('--fixed');
                _this.switchView.addClass('--collection');
                _this._updateScroll(false);
            }
        });

        $(document).on('data-filter-url-changed', function () {
            _this.render();
        });
    };

    MapCollection.prototype._setInitialState = function () {
        if (!this.switchView.hasClass('--collection')) {
            if (window.location.hash.length) {
                window.location.href = window.location.href.replace(/#.*/, '');
            }
            this._updateScroll(true);
        }
    };

    MapCollection.prototype._updateScroll = function (locked) {
        if (locked) {
            $(window).scrollTop(0);
        }

        Scroll.updateLock();
    };

    MapCollection.prototype._deleteAllMarkers = function () {
        if (this.cluster !== undefined) {
            this.cluster.clearMarkers();
        }
    };

    MapCollection.prototype._addOverlay = function () {
        this.mapWindow.prepend(
            '<div class="overlay">'+
            '<div class="working"></div>'+
            '</div>'
        );
    };

    MapCollection.prototype._removeOverlay = function () {
        this.mapWindow.find('.overlay').remove();

        if ($('#map-bg-container').length == false) {
            this.mapWindow.find('.gm-style div:first').attr('id', 'map-container');
            this.mapWindow.find('.gm-style div:first').append('<div id="map-bg-container"></div>');
        }
    };

    MapCollection.prototype._updateQueryState = function (key, val) {
        var oldUrl = window.location.href;
        var newUrl = oldUrl
            .replace(RegExp("([?&]"+key+"(?=[=&#]|$)[^#&]*|(?=#|$))"), "&"+key+"="+encodeURIComponent(val))
            .replace(/^([^?&]+)&/, "$1?");

        history.replaceState({}, oldUrl, newUrl);
    };

    MapCollection.prototype._getCollectionURL = function () {
        return this.collectionURL+window.location.search;
    };

    window.MapCollection = MapCollection;

})(window, jQuery);
