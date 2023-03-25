;(function (window, $) {
    "use strict";

    function MapItem(map) {
        MapAbstract.call(this, map);

        this.isAddressHidden = this.mapCanvas.attr('data-address-hidden') !== undefined;
        this.latLng = new google.maps.LatLng(
            this.mapCanvas.attr('data-maplat'),
            this.mapCanvas.attr('data-maplng')
        );
        this.map = new google.maps.Map(this.mapCanvas[0], {
            styles: window.mapStyles,
            zoom: this.isAddressHidden ? 13 : 10,
            center: this.latLng,
            backgroundColor: '#333',
            zoomControl: true,
            fullscreenControl: true,
            streetViewControl: false,
            mapTypeControl: false,
        });

        this.render();
        this.bindEvents();
    }

    MapItem.prototype = Object.create(MapAbstract.prototype);
    MapItem.prototype.constructor = MapItem;

    MapItem.prototype.render = function () {
        var _this = this;

        if (this.isAddressHidden == false) {
            new google.maps.Marker({
                position: _this.latLng,
                map: this.map,
                icon: this.iconHover + this.iconExt
            });
        } else {
            var circle = new google.maps.Circle({
                strokeColor: '#000',
                strokeOpacity: 0.3,
                strokeWeight: 0,
                fillColor: '#000',
                fillOpacity: 0.3,
                map: this.map,
                center: _this.latLng,
                radius: 500
            });

            google.maps.event.addListener(this.map, "zoom_changed", function () {
                var zoomLevel = _this.map.getZoom();
                var p = Math.pow(2, (21 - zoomLevel));
                var radius = (p * 1128.497220 * 0.0027) / 5;
                var min = 500;

                // Radius calculation, based on exp. of current zoom
                // https://gist.github.com/prwhitehead/9cc4ab269d1cc732f92e

                // Where "1128.497220" - minimal ratio (for "20" zoom)
                // more ratios: https://gis.utah.gov/developer/base-maps/basemap-scales/

                circle.setRadius(radius < min ? min : radius);
            });
        }
    };

    $(document).ready(function () {
        var map = $('.map.--item');

        if (map.length) {
            new MapItem(map);
        }
    });

})(window, jQuery);
