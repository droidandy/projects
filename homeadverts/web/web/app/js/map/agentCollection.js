;(function (window, $) {
    "use strict";

    function MapAgentCollection(map) {
        MapCollection.call(this, map);

        this.render();
    }

    MapAgentCollection.prototype = Object.create(MapCollection.prototype);
    MapAgentCollection.prototype.constructor = MapAgentCollection;

    MapAgentCollection.prototype.bindMarkerEvents = function (marker) {
        var _this = this;
        var infoWindow = new google.maps.InfoWindow({
            disableAutoPan: true,
            content:
            "<div class='name'>"+marker.item.name+"</div>"+
            "<div class='company'>"+marker.item.company+"</div>"
        });


        google.maps.event.addListener(infoWindow, 'domready', function() {
            $('.gm-style-iw').addClass('--display');
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            marker.setIcon(_this.icon+_this.iconExt);
            infoWindow.close();
        });

        if (!window.isMobile) {
            google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.open(_this.map, this);
            });
        }

        google.maps.event.addListener(marker, 'click', function () {
            window.open(marker.item.url, '_blank').focus();
        });
    };

    MapAgentCollection.prototype.render = function () {
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
                        icon: _this.icon+_this.iconExt,
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

    $(document).ready(function () {
        var map = $('.map.--agent-collection');

        if (map.length) {
            new MapAgentCollection(map);
        }
    });

})(window, jQuery);
