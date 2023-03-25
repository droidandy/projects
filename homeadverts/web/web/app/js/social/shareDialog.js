;(function (window, $) {
    'use strict';

    function ShareDialog(className) {
        this.dialog = $(className);
        
        if (!this.dialog.length) {
            return;
        }
        
        this.media = this.dialog.find('.media .image');
        this.closeButton = this.dialog.find('.close');
        this.shareLink = this.dialog.find('.link-to-share');

        this.init();
    }

    ShareDialog.prototype.init = function () {
        var _this = this;

        this.shareLink.on('click', function () {
            _this.copyLink();
        });

        this.dialog[0].addEventListener('click', function (event) {
            var rect = _this.dialog[0].getBoundingClientRect();
            var isInDialog = (
                rect.top <= event.clientY
                && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX
                && event.clientX <= rect.left + rect.width
            );

            if (!isInDialog) {
                _this.dialog[0].close();
                _this.unsetImage();
            }
        });

        this.dialog.on('click', 'a', function () {
            _this.dialog[0].close();
            _this.unsetImage();
        });

        this.closeButton.on('click', function () {
            _this.dialog[0].close();
            _this.unsetImage();
        });
    };
    
    ShareDialog.prototype.unsetImage = function () {
        this.media.css(
            'background-image', ''
        );
    };
    
    ShareDialog.prototype.copyLink = function () {
        document.querySelector('.link-to-share').select();
        document.execCommand('copy');

        window.snackbar.MaterialSnackbar.showSnackbar({
            message: "The link copied to your clipboard"
        });
    };


    $(document).ready(function () {
        new ShareDialog('.share-dialog');
    });

})(window, jQuery);
