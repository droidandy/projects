;( function (window) {
    'use strict';
    
    function MapAbstract (map) {
        this.mapWindow = map;
        
        this.mapCanvas = this.mapWindow.find('.map-canvas');
        
        var isSwitchView = this.mapCanvas.closest('.switch-views').length !== 0,
            gestureHandling = isSwitchView ? 'greedy' : 'auto';
        
        this.zoom = 10;
        this.isExpanded = false;
        this.map = new google.maps.Map(this.mapCanvas[0], {
            styles: window.mapStyles,
            zoom: this.zoom,
            backgroundColor: '#333',
            zoomControl: true,
            streetViewControl: false,
            scaleControl: false,
            mapTypeControl: false,
            gestureHandling: gestureHandling,
        });
        
        this.icon = '/assets/images/map/map-marker';
        this.iconHover = '/assets/images/map/map-marker-hover';
        this.iconExt = '.png';
    }
    
    MapAbstract.prototype.bindEvents = function () {
        var _this = this;
        
        google.maps.event.addDomListener(window, "resize", function () {
            _this.map.setCenter(_this.latLng);
        });
    };
    
    window.MapAbstract = MapAbstract;
    
} )(window);
