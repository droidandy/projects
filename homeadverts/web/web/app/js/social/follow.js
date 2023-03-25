;(function (window, $) {
    'use strict';
    
    function FollowButton (className) {
        this.followButton = $(className);
        
        this.bindEvents();
    }
    
    FollowButton.prototype.bindEvents = function () {
        this.followButton.on('click', function () {
            if (window.user) {
                
                var button = $(this);
                var popupHosts = $('.user-popup' + button.attr('data-id'));
                var name = button.attr('data-name');
                var isFollowing = button.hasClass('--following');
                var request = {};
                
                button.attr('disabled', 'disabled');
                
                if (isFollowing) {
                    request = {
                        url: button.attr('data-unfollow-url'),
                        message: 'You stopped following ' + name,
                        method: 'DELETE',
                    };
                } else {
                    request = {
                        url: button.attr('data-follow-url'),
                        message: 'You started following ' + name,
                        method: 'POST',
                    };
                }
                
                $.ajax({
                    url: request.url,
                    method: request.method,
                    contentType: 'application/json',
                    success: function (res, status, xhr) {
                        console.log(popupHosts);
                        
                        if (isFollowing) {
                            button.removeClass('--following');
                            popupHosts.attr('data-is-following', false);
                        } else {
                            button.addClass('--following');
                            popupHosts.attr('data-is-following', true);
                        }
                        
                        window.snackbar.MaterialSnackbar.showSnackbar({
                            message: request.message,
                        });
                        
                        button.removeAttr('disabled');
                    },
                    error: function (data, textStatus, jqXHR) {
                        button.removeAttr('disabled');
                    },
                });
                
            } else {
                dispatchNewEvent('authNeeded');
            }
        });
    };
    
    $(document).ready(function () {
        new FollowButton('.follow-button');
    });
    
})(window, jQuery);
