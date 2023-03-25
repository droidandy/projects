;(function (window, $) {
    'use strict';

    function Share(button) {
        this.button = button;
        this.dialog = $('.share-dialog');
        
        this.url = this.button.attr('data-url');
        this.title = this.button.attr('data-title');
        this.mediaUrl = this.button.attr('data-image');
        
        this.media = this.dialog.find('.media .image');
        this.shareOptions = this.dialog.find('.share-options a');
        this.shareTitle = this.dialog.find('.heading span');
        this.shareLink = this.dialog.find('.link-to-share');
        this.button.addClass('is-upgraded');

        this.init();
    }

    Share.prototype.init = function () {
        var _this = this;

        if (!this.dialog[0].showModal) {
            dialogPolyfill.registerDialog(this.dialog[0]);
        }

        this.button.on('click', function () {
            _this.setLinks();
            _this.setImage();
            _this.dialog[0].showModal();
            dispatchNewEvent(_this.dialog[0], 'showModal');
        });
    };

    
    Share.prototype.setImage = function () {
        this.media.css(
            'background-image', 'url("' + this.mediaUrl + '")'
        );
    };
    
    Share.prototype.setLinks = function () {
        var _this = this;

        this.shareOptions.map(function (index, item) {
            var option = $(item);
            var href = option.attr('data-href') + _this.url;

            option.attr('href', href);
        });

        this.shareTitle.text(this.title);
        this.shareLink.val(this.url);
    };

    var boot = function () {
        var buttons = $('.share:not(.is-upgraded)');
        var articleShareButtons = $('.share-button');

        buttons.each(function (i, button) {
            new Share($(button));
        });
        articleShareButtons.each(function (i, button) {
            new Share($(button));
        });
    };

    $(document).ready(function () {
        boot();
    });

    window.addEventListener('paginationUpdated', boot, false);

})(window, jQuery);
