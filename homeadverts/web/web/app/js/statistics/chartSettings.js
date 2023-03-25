;(function (window) {
    'use strict';

    window.chartSettings = {
        "dataDateFormat": "YYYY-MM-DD",
        "type": "serial",
        "valueAxes": [{
            "axisAlpha": 0,
            "dashLength": 4,
            "position": "left",
            "integersOnly": true
        }],
        "startDuration": 1,
        "graphs": [{
            "fillColors": "#ff9200",
            "lineColor": "#ff9200",
            "showBalloon": false,
            "alphaField": "alpha",
            "fillAlphas": 1,
            "title": "Views",
            "type": "column",
            "valueField": "value"
        }],
        "categoryField": "date",
        "categoryAxis": {
            "axisAlpha": 0,
            "gridAlpha": 0,
            "tickLength": 0,
            "parseDates": true,
            "equalSpacing": true
        }
    };

})(window);
