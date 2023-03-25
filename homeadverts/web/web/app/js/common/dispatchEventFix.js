;(function (window, $) {
    "use strict";

    window.dispatchNewEvent = function (element, eventType) {
        if (typeof(element) === 'string' && eventType === undefined) {
            eventType = element;
            element = window;
        }

        var event;

        if(typeof(Event) === 'function') {
            event = new Event(eventType);
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventType, true, true);
        }

        element.dispatchEvent(event);
    };

})(window, jQuery);

