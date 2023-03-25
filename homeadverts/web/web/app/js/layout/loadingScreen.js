;(function (window, $) {

    function LoadingScreen(idName) {
        this.container = $(idName);

        this.bindEvents();
    }

    LoadingScreen.prototype.bindEvents = function () {
        var _this = this;

        window.addEventListener('showLoadingScreen', function () {
            _this.show();
        }, false);
        window.addEventListener('hideLoadingScreen', function () {
            _this.hide();
        }, false);
    };

    LoadingScreen.prototype.show = function () {
        $('body').addClass('--no-scroll');
        this.container.addClass('--visible');
    };

    LoadingScreen.prototype.hide = function () {
        $('body').removeClass('--no-scroll');
        this.container.removeClass('--visible');
    };

    $(document).ready(function () {
        new LoadingScreen('#loading-screen');
    });

})(window, jQuery);
