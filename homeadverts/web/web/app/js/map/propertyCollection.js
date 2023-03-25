;(function (window, $) {
    "use strict";

    function MapPropertyCollection(map) {
        MapCollection.call(this, map);

        this.carousel = $('#map-carousel');
        this.clusterPreloadLimit = 2;

        this.bindMapCollectionEvents();
        this.render();
    }

    MapPropertyCollection.prototype = Object.create(MapCollection.prototype);
    MapPropertyCollection.prototype.constructor = MapPropertyCollection;

    MapPropertyCollection.prototype.bindMarkerEvents = function (marker) {
        var _this = this;
        var infoWindow = new google.maps.InfoWindow({
            disableAutoPan: true,
            content:
            "<div class='location'>"+marker.item.address+"</div>"+
            "<div class='price'>"+marker.item.price+"</div>"
        });

        google.maps.event.addListener(infoWindow, 'domready', function() {
            $('.gm-style-iw').addClass('--display');
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            marker.setIcon(_this.icon+_this.iconExt);
            infoWindow.close();
            _this.hidePreview();
        });

        if (!window.isMobile) {
            google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.open(_this.map, this);
                _this.showPreview(marker);
            });
        }

        google.maps.event.addListener(marker, 'click', function () {
            _this.showCarousel(marker);
        });
    };

    MapPropertyCollection.prototype.bindMapCollectionEvents = function () {
        var _this = this;

        google.maps.event.addListener(this.cluster, 'clusteringend', function () {
            _this.preloadPreviews();
        });
    };

    MapPropertyCollection.prototype.render = function () {
        var _this = this;

        this._deleteAllMarkers();
        this._addOverlay();

        $.ajax({
                url: this._getCollectionURL(),
                type: 'GET',
                data: {},
                dataType: 'json'
            })
            .done(function (result, status, xhr) {
                if (result.length) {
                    var bounds = new google.maps.LatLngBounds();

                    $.each(result, function (key, data) {
                        var latLng = new google.maps.LatLng(data.location[0], data.location[1]);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: _this.map,
                            icon: _this.icon + _this.iconExt,
                            item: data
                        });

                        bounds.extend(latLng);
                        _this.cluster.addMarker(marker);
                        _this.bindMarkerEvents(marker);
                    });

                    if (_this.map.getZoom() < 3) {
                        _this.map.setZoom(3);
                    }

                    //by default, if there is only one marker, the map zooms right in, we dont want this
                    if (_this.cluster.getMarkers().length === 1) {
                        _this.map.setZoom(14);
                    }

                    _this.map.fitBounds(bounds);
                }

                _this._removeOverlay();
            });
    };

    MapPropertyCollection.prototype.showCarousel = function (marker) {
        var cell = this.mapWindow.attr('data-carousel-cell-template'),
            video = '',
            cells = '',
            absoluteUrlPrefix = window.location.protocol + '//' + window.location.host;

        if (marker.item.video) {
            video = this.mapWindow.attr('data-carousel-video-template')
                .replace(/%PROPERTY_VIDEO_TYPE%/g, marker.item.video.type)
                .replace(/%PROPERTY_VIDEO_URL%/g, marker.item.video.url);
        }

        marker.item.photos.forEach(function (photo, index) {
            cells += cell
                .replace(/%PROPERTY_VIDEO%/g, video )
                .replace(/%PROPERTY_URL%/g, marker.item.url)
                .replace(/%PROPERTY_ABSOLUTE_URL%/g, absoluteUrlPrefix + marker.item.url)
                .replace(/%PHOTO_URL%/g, photo.url)
                .replace(/%PHOTO_LAZYLOAD%/g, photo.lazyload)
                .replace(/%PHOTO_INDEX%/g, index);
        });

        var carousel = this.mapWindow.attr('data-carousel-template')
            .replace(/%PROPERTY_VIDEO%/g, video)
            .replace(/%PROPERTY_URL%/g, marker.item.url)
            .replace(/%PROPERTY_ABSOLUTE_URL%/g, absoluteUrlPrefix + marker.item.url)
            .replace(/%PROPERTY_ID%/g, marker.item.id)
            .replace(/%PHOTO_CELLS%/g, cells);

        this.carousel
            .attr('data-property-id', marker.item.id)
            .attr('data-source-map', true)
            .attr('data-listhub-sourceRef', marker.item.sourceRef)
            .find('[data-gallery-content]').html('<!--'+carousel+'-->');

        new ModalCarousel(this.carousel);
    };

    MapPropertyCollection.prototype.showPreview = function (marker) {
        marker.setIcon(this.iconHover+this.iconExt);

        $('#map-bg-'+marker.item.id).addClass('--display');
        $('#map-container').addClass('--transparent');
    };

    MapPropertyCollection.prototype.hidePreview = function () {
        $('.map-bg').removeClass('--display');
        $('#map-container').removeClass('--transparent');
    };


    MapPropertyCollection.prototype.preloadPreviews = function () {
        var _this = this;

        _this.cluster.clusters_.forEach(function (cluster) {
            var markers = cluster.getMarkers();

            if (markers.length <= _this.clusterPreloadLimit) {
                markers.forEach(function (marker) {

                    if ($('#map-bg-'+marker.item.id).length == false){
                        $('#map-bg-container').append(
                            "<div "+
                            "id='map-bg-"+marker.item.id+"'"+
                            "class='map-bg cover'"+
                            "style='background:url("+marker.item.photos[0].url+")'></div>"
                        );
                    }
                });
            }
        });
    };

    $(document).ready(function () {
        var map = $('.map.--property-collection');

        if (map.length) {
            new MapPropertyCollection(map);
        }
    });

})(window, jQuery);
