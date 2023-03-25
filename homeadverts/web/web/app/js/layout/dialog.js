;(function (window, $) {

    function Dialog() {
        this.dialogs = $('dialog');
        this.body = $('body');
        
        this.bindEvents();
    }

    Dialog.prototype.bindEvents = function () {
        this.dialogs
            .on('showModal', $.proxy(this, 'onShow'))
            .on('close', $.proxy(this, 'onHide'));
    };

    Dialog.prototype.animateDialog = function () {
        setTimeout(function () {
            $('dialog[open]').addClass('--shown');
        }, 0);
    };

    Dialog.prototype.onShow = function () {
        this.animateDialog();
        Scroll.updateLock();
    
        this.body.addClass('__blur');
    };

    Dialog.prototype.onHide = function () {
        this.dialogs.removeClass('--shown');
        Scroll.updateLock();
    
        this.body.removeClass('__blur');
    };

    $(document).ready(function () {
        new Dialog();
    });

})(window, jQuery);
