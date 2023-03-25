;( function (window, $) {
    'use strict';
    
    function ProfilePopup (
        host, overflowOffsetVertical, profileOffsetHorisontal) {
        if (host.hasClass('__upgraded')) {
            return;
        }
        
        this.overflowOffsetVertical = overflowOffsetVertical;
        this.profileOffsetHorisontal = profileOffsetHorisontal;
        
        this.profile = $('#profile-popup');
        this.overlay = this.profile.find('.overlay');
        this.host = host;
        
        this.init();
    }
    
    ProfilePopup.prototype.init = function () {
        var _this = this;
        
        this.host.addClass('__upgraded');
        
        this.profile.on('mouseleave', function () {
            _this.hide();
        });
        this.host.on('mouseenter mouseleave', function (event) {
            _this.requestAndShow(event, this);
        });
    };
    
    ProfilePopup.prototype.requestAndShow = function (event, el) {
        var _this = this;
        var $el = $(el);
        
        if (event.type == 'mouseenter') {
            var position = this.getPosition(event);
            
            $.ajax({
                url: $el.attr('data-url'),
                method: 'GET',
                contentType: 'application/json',
                success: function (res, status, xhr) {
                    var data = JSON.parse(res);
                    
                    _this.setFollowButtonData($el);
                    _this.setDetailsData($el, data);
                    _this.show($el, position);
                    
                    $el.addClass('__popup-visible');
                },
            });
        }
    };
    
    /**
     * @param {jQuery} $el
     * @param {string} position
     * @returns {string}
     */
    ProfilePopup.prototype.show = function ($el, position) {
        var top = $el.offset().top;
        var left = $el.offset().left;
        var right = ( $(window).width() - ( left + $el.outerWidth() ) );
        
        this.profile.removeClass('top-left');
        this.profile.removeClass('top-right');
        this.profile.removeClass('bottom-left');
        this.profile.removeClass('bottom-right');
        
        this.profile.addClass(position);
        
        this.overlay.css({
            height: $el.height() + 5,
            width: $el.width(),
            left: '',
            right: '',
            top: '',
            bottom: '',
        });
        
        if (position === 'top-left') {
            this.profile.css({
                top: ( top + $el.height() ) + 'px',
                left: left - this.profileOffsetHorisontal + 'px',
                right: '',
                bottom: '',
            });
            this.overlay.css({
                top: -this.overflowOffsetVertical + 'px',
                left: 0,
            });
        }
        if (position === 'top-right') {
            this.profile.css({
                top: ( top + $el.height() ) + 'px',
                right: right - this.profileOffsetHorisontal + 'px',
                left: '',
                bottom: '',
            });
            this.overlay.css({
                top: -this.overflowOffsetVertical + 'px',
                right: 0,
            });
        }
        if (position === 'bottom-left') {
            this.profile.css({
                top: ( top - this.profile.height() ) + 'px',
                left: left - this.profileOffsetHorisontal + 'px',
                right: '',
                bottom: '',
            });
            this.overlay.css({
                bottom: -this.overflowOffsetVertical + 'px',
                left: 0,
            });
        }
        if (position === 'bottom-right') {
            this.profile.css({
                top: ( top - this.profile.height() ) + 'px',
                right: right - this.profileOffsetHorisontal + 'px',
                left: '',
                bottom: '',
            });
            this.overlay.css({
                bottom: -this.overflowOffsetVertical + 'px',
                right: 0,
            });
        }
        
        this.profile.show();
    };
    
    ProfilePopup.prototype.hide = function () {
        var _this = this;
        
        setTimeout(function () {
            _this.profile.hide();
            _this.host.removeClass('__popup-visible');
        }, 100);
    };
    
    /**
     * @param event
     * @returns {string}
     */
    ProfilePopup.prototype.getPosition = function (event) {
        var squareWidth = window.innerWidth / 2;
        var squareHeight = window.innerHeight / 2;
        var square = '';
        
        if (event.screenY / squareHeight < 1) {
            square = square + 'top';
        } else {
            square = square + 'bottom';
        }
        
        if (event.screenX / squareWidth < 1) {
            square = square + '-left';
        } else {
            square = square + '-right';
        }
        
        return square;
    };
    
    /**
     * @param {jQuery} $el
     */
    ProfilePopup.prototype.setFollowButtonData = function ($el) {
        var button = this.profile.find('.follow-button');
        var isFollowing = $el.attr('data-is-following');
        
        button.removeClass('--following');
        
        if (isFollowing) {
            button.addClass('--following');
        }
        
        button.attr('data-id', $el.attr('data-id'));
        button.attr('data-name', $el.attr('data-name'));
        button.attr('data-follow-url', $el.attr('data-url-follow'));
        button.attr('data-unfollow-url', $el.attr('data-url-unfollow'));
    };
    
    /**
     * @param {jQuery} $el
     * @param {{}} data
     */
    ProfilePopup.prototype.setDetailsData = function ($el, data) {
        var $bio = this.profile.find('.bio');
        var $followers = this.profile.find('.followers');
        var $articles = this.profile.find('.articles');
        var $properties = this.profile.find('.properties');
        
        $bio.hide();
        $properties.hide();
        $articles.hide();
        $followers.hide();
        
        if (data.bio) {
            $bio.text(data.bio);
            $bio.show();
        }
        if (data.followersCount) {
            $followers.show();
        }
        if (data.articlesCount) {
            $articles.show();
        }
        if (data.propertiesCount) {
            $properties.show();
        }
        
        this.overlay
            .attr('href', $el.attr('data-url-profile'));
        this.profile
            .find('a').attr('href', $el.attr('data-url-profile'));
        this.profile
            .find('.articles')
            .attr('href', $el.attr('data-url-articles'));
        this.profile
            .find('.properties')
            .attr('href', $el.attr('data-url-properties'));
        this.profile
            .find('.followers')
            .attr('href', $el.attr('data-url-followers'));
        this.profile
            .find('.message-button')
            .attr('href', data.links.message);
        
        this.profile.find('.name').text($el.attr('data-name'));
        this.profile.find('.photo').css({
            'background-image': 'url(' + $el.attr('data-image') + ')',
        });
        this.profile.find('.background').css({
            'background-image': 'url(' + $el.attr('data-background') + ')',
        });
    };
    
    var boot = function () {
        var profileImages = $('.story-card .profile-block-image');
        var userNames = $(
            '.property-list-item .username, .story-card .username');
        
        profileImages.map(function (i, item) {
            new ProfilePopup($(item), 35, 8);
        });
        userNames.map(function (i, item) {
            new ProfilePopup($(item), 15, 0);
        });
    };
    
    $(document).ready(function () {
        boot();
    });
    window.addEventListener('commentsAppear', boot, false);
    window.addEventListener('paginationUpdated', boot, false);
    
} )(window, jQuery);
