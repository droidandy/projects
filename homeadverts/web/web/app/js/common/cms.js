;(function (window, $) {
    'use strict';

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    window.galleryLazyload = 3;
    window.sliderLazyload = 2;
    window.mobileScreenWidth = 768 + 1;
    window.slyOptions = {
        horizontal: 1,
        itemNav: 'basic',
        speed: 1000,
        easing: 'easeOutExpo',
        dragSource: document, // Binds dragging listeners to `document`

        // Scrolling
        scrollSource: null,  // Element for catching the mouse wheel scrolling. Default is FRAME.
        scrollBy: 100,     // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
        scrollHijack: 300,   // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
        scrollTrap: false, // Don't bubble scrolling when hitting scrolling limits.

        // Dragging
        mouseDragging: 1, // Enable navigation by dragging the SLIDEE with mouse cursor.
        touchDragging: 1, // Enable navigation by dragging the SLIDEE with touch events.
        releaseSwing: 1, // Ease out on dragging swing release.
        swingSpeed: 0.1,   // Swing synchronization speed, where: 1 = instant, 0 = infinite.
        elasticBounds: 1, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
        interactive: null,  // Selector for special interactive elements.

        // Scrollbar
        scrollBar: null,  // Selector or DOM element for scrollbar container.
        dragHandle: true, // Whether the scrollbar handle should be draggable.
        dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
        minHandleSize: 50,    // Minimal height or width (depends on sly direction) of a handle in pixels.
        clickBar: false, // Enable navigation by clicking on scrollbar.
        syncSpeed: 0      // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.
    };

    if (isMobile.any()) {
        window.isMobile = true;
        window.pointerEventType = "touchstart";
    } else {
        window.isMobile = false;
        window.pointerEventType = "click";
    }

    /**
     * Scroll toggle
     */
    window.toggleScroll = function (state) {
        if (state == 'disable') {
            $('body').bind('mousedown.prev DOMMouseScroll.prev mousewheel.prev keydown.prev keyup.prev touchmove', function (e, d) {
                e.preventDefault();
            });
        } else {
            $('body').unbind('mousedown.prev DOMMouseScroll.prev mousewheel.prev keydown.prev keyup.prev touchmove');
        }
    };

    function setAjaxTransport() {
        var token = $.cookie("XSRF-TOKEN");

        if (token) {
            $.ajaxSetup({
                headers: {
                    "X-XSRF-TOKEN": token
                }
            });
        }
    }

    /**
     * Request agents phones
     */
    $(document).ready(function () {
        setAjaxTransport();

        window.snackbar = document.querySelector('#snackbar');

        /**
         * A small, stand-alone script to automatically adjust textarea height.
         * http://www.jacklmoore.com/autosize/
         */
        autosize($('textarea'));
    });

})(window, jQuery);
