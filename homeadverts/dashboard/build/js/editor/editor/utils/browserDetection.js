;(function ($, window, document) {

    $.browser = $.browser || {};
    $.browser.isIE = /*@cc_on!@*/false || !!document.documentMode;
    $.browser.isEdge = !$.browser.isIE && !!window.StyleMedia;
    $.browser.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

})(jQuery, window, document);
