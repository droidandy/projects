;(function (window, $) {
    'use strict';
    
    // Preventing duplications by saving displayed ids ids in array.
    var displayedItems = {
        article: {
            impression: [],
            view: []
        },
        property: {
            impression: [],
            view: []
        }
    };
    
    function EventTracking() {
        this.url = $('body').attr('data-url-statistics-tracking');

        this.property = {
            card: '.property-list-item',
            details: '.inline-carousel',
            image: '.list-image'
        };
        this.article = {
            card: '.story-card',
            details: '.read-story'
        };

        this.initScrollListenersArticle();
        this.initScrollListenersProperty();
        this.initEventListeners();
    }

    EventTracking.prototype.initEventListeners = function () {
        var _this = this;

        $(this.property.card + ' ' + this.property.image).click(function (event) {
            var property = $(this).closest(_this.property.card),
                sourceRef = property.attr('data-listhub-sourceRef'),
                sourceId;

            if (property.attr('data-source-map')) {
                sourceId = 3;  // SOURCE_MAP
            } else {
                sourceId = 1;  // SOURCE_COLLECTION
            }

            _this.trackListhub(sourceRef, 'VIEWED_ON_CHANNEL');
            _this.trackEvent({
                id: property.attr('data-property-id'),
                model: 'property',
                source: sourceId,
                event: 'view'
            });
        });
    };

    EventTracking.prototype.initScrollListenersArticle = function () {
        var _this = this;

        // Impression
        $(this.article.card).waypoint({
            handler: function () {
                var id = $(this.element).attr('data-id');
                
                if (displayedItems.article.impression.indexOf(id) === -1) {
                    _this.trackEvent({
                        id: id,
                        model: 'article',
                        source: 1,
                        event: 'impression'
                    })
                }
            }
        });

        // View
        if ($(this.article.details).is(":visible")) {
            var id = $(this.article.details).attr('data-id');

            if (displayedItems.article.view.indexOf(id) === -1) {
                _this.trackEvent({
                    id: id,
                    model: 'article',
                    source: 2,
                    event: 'view'
                })
            }
        }
    };

    EventTracking.prototype.initScrollListenersProperty = function () {
        var _this = this;

        // Impression
        $(this.property.card).waypoint({
            handler: function () {
                var id = $(this.element).attr('data-property-id');
                var sourceRef = $(this.element).attr('data-listhub-sourceRef');

                if (displayedItems.property.impression.indexOf(id) === -1) {
                    _this.trackEvent({
                        id: id,
                        model: 'property',
                        source: 1, // SOURCE_COLLECTION
                        event: 'impression'
                    });
                    _this.trackListhub(sourceRef, 'SEARCH_DISPLAY');
                }
            }
        });

        // View
        if ($(this.property.details).is(":visible")) {
            var id = $(this.property.details).attr('data-id');
            var sourceRef = $(this.property.details).attr('data-listhub-sourceRef');

            if (displayedItems.property.impression.indexOf(id) === -1) {
                _this.trackEvent({
                    id: id,
                    model: 'property',
                    source: 2,
                    event: 'view'
                });
                _this.trackListhub(sourceRef, 'VIEWED_ON_CHANNEL');
            }
        }
    };

    /**
     * @param {string} sourceRef
     * @param {string} eventName
     */
    EventTracking.prototype.trackListhub = function (sourceRef, eventName) {
        if ('undefined' !== typeof sourceRef) {
            _lh.submit(eventName, data.listhub);
        }
    };

    /**
     * @param {Object} data
     */
    EventTracking.prototype.trackEvent = function (data) {
        if (data['id']) {
            displayedItems[data['model']][data['event']].push(data['id']);
    
            $.ajax({
                url: this.url,
                method: "POST",
                data: JSON.stringify(data),
                contentType: "application/json"
            });
        }
    };
    
    var boot = function () {
        new EventTracking();
    };
    
    $(document).ready(function () {
        boot();
    });
    window.addEventListener('paginationUpdated', function () {
        boot();
    }, false);
    
})(window, jQuery);
