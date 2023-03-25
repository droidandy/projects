;(function (window, $) {
    'use strict';

    function FlashMessage(className) {
        this.FlashMessage = $(className);

        if (!this.FlashMessage.length) {
            return;
        }

        this.closeButton = this.FlashMessage.find('.close');
        this.timeout = 3000;

        this.bindEvents();
    }

    FlashMessage.prototype.bindEvents = function () {
        var _this = this;

        setTimeout(function(){
            _this.FlashMessage.remove();
        }, this.timeout);

        this.closeButton.click(function (e) {
            _this.FlashMessage.remove();
        });
    };

    $(document).ready(function () {
        new FlashMessage('.flash-FlashMessage');
    });


})(window, jQuery);