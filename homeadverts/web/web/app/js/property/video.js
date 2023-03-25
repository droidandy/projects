;(function (window, $) {
    'use strict';

    function PropertyVideo(wrapper) {
        this.wrapper = $('.video-wrapper');

        if (!this.wrapper.length) {
            return;
        }

        this.closeButton = this.wrapper.find('.video-close');
        this.videoYoutubeParameters = "?theme=light&controls=0&autoplay=0&rel=0&showinfo=0&enablejsapi=1";

        this.videoYoutube = $('#property-video-youtube');
        this.videoWellcomemat = $('#property-video-wellcomemat');
        this.poweredByLink = $('.powered-by-wellcomemat');

        this.bindEvents();
    }

    PropertyVideo.prototype.bindEvents = function () {
        var _this = this;

        $(document).on('video-events-update', function () {
            $('.play-video').on(window.pointerEventType, function (e) {
                var type = $(this).attr("data-type");
                var url = $(this).attr("data-url");

                if (_this.url != url) {
                    _this.setVideo(type, url);
                    _this.updatePlayerEvents();
                }

                _this.openAndPlay();

                e.stopPropagation();
                e.preventDefault();
            });
        });

        $(window).bind('keyup', function(e) {
            if (_this.url && (e.which == 27)) {
                _this.pauseAndClose();
            }
        });

        this.closeButton.on(window.pointerEventType, function (e) {
            e.stopPropagation();
            e.preventDefault();

            _this.pauseAndClose();
        });
    };

    PropertyVideo.prototype.updatePlayerEvents = function () {
        var _this = this;

        this.videoWellcomemat.off();

        if (this.type == 'wellcomemat') {
            if (window.isMobile === false) {
                this.videoWellcomemat.on('click', function() {
                    this[this.paused ? 'play' : 'pause']();
                });

                this.videoWellcomemat.bind("ended", function() {
                    _this.wrapper.removeClass('--open');
                });
            } else {
                this.videoWellcomemat.bind("ended", function() {
                    _this.videoWellcomemat[0].webkitExitFullScreen();
                });
            }
        } else {
            this.videoYoutubePlayer.addEventListener('onStateChange', function(event){
                if (event.data === 0) {
                    _this.wrapper.removeClass('--open');
                }
            });
        }
    };

    PropertyVideo.prototype.setVideo = function (type, url) {
        var _this = this;
        this.type = type;
        this.url = url;
        this.videoWellcomemat.hide();
        this.videoYoutube.hide();

        if (this.type == 'wellcomemat') {
            this.videoWellcomemat.show();
            this.videoWellcomemat.attr("src", url);
            this.videoWellcomemat[0].load();
            this.poweredByLink.show();
        } else {
            this.videoYoutube.show();
            this.videoYoutube.attr("src", url+this.videoYoutubeParameters);
            this.videoYoutubePlayer = new YT.Player('property-video-youtube', {
                events: {
                    'onReady': function(event) {
                        if (_this.isPhone === false) {
                            event.target.playVideo();
                        }
                    }
                }
            });
            this.poweredByLink.hide();
        }
    };

    PropertyVideo.prototype.openAndPlay = function(){
        if (this.type == 'wellcomemat') {
            this.videoWellcomemat[0].play();

            if (window.isMobile === false) {
                this.wrapper.addClass('--open');
            }
        } else {
            this.wrapper.addClass('--open');
        }
    };

    PropertyVideo.prototype.pause = function(){
        if (this.type == 'wellcomemat') {
            this.videoWellcomemat[0].pause();
        } else {
            this.videoYoutubePlayer.pauseVideo();
        }
    };

    PropertyVideo.prototype.pauseAndClose = function(){
        if (this.type == 'wellcomemat') {
            if (window.isMobile === false) {
                this.wrapper.removeClass('--open');
            }
        } else {
            this.wrapper.removeClass('--open');
        }
        this.pause();
    };

    $(document).ready(function () {
        new PropertyVideo('.video-wrapper');

        $(document).trigger('video-events-update');
    });


})(window, jQuery);