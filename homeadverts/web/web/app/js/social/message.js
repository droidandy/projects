;(function (window, $) {
    'use strict';
    
    function MessageButton(className) {
        this.button = $(className);
        
        this.bindEvents();
    }
    
    MessageButton.prototype.bindEvents = function () {
        this.button.on('click', function (e) {
            if (!window.user) {
                e.preventDefault();
                dispatchNewEvent('authNeeded');
            }
        });
    };
    
    $(document).ready(function () {
        new MessageButton('.message-button');
    });
    
})(window, jQuery);
