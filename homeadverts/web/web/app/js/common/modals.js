;(function (window, $) {
    'use strict';

    $(document).ready(function () {

        var modal = $('.modal-overlay');

        $('.modal-overlay .close-modal').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            modal.removeClass('show');
        });

        $(document).keyup(function (e) {
            if (e.keyCode == 27) { // esc keycode
                modal.removeClass('show');
            }
        });

        modal.on('click', function (e) {
            if (e.target !== this)
                return;
            modal.removeClass('show');
        });
        $('.modal-window').on('click', function (e) {
            if (e.target !== this)
                return;
            modal.removeClass('show');
        });
    });

})(window, jQuery);