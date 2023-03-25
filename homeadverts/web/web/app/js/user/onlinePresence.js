;( function (window, $) {
    'use strict';
    
    var API_PUSHER_ONLINE = '/api/user/pusher/authOnline';
    var CHANNEL_NAME = 'presence-online';
    var PUSHER_KEY = '8694afcdaba2044a05c8';
    var PUSHER_CLUSTER = 'eu';
    
    function OnlinePresence () {
        Pusher.logToConsole = true;
        Pusher.Runtime.createXHR = function () {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            
            return xhr;
        };
        
        this.pusher = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
            authEndpoint: API_PUSHER_ONLINE,
            auth: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        });
        
        this.subscribePusherOnlineChannel();
    }
    
    OnlinePresence.prototype.setUserOnline = function (user) {
        console.log('----> ' + user.name + ' is Online');
        $('.online-' + user.id).addClass('__active');
    };
    
    OnlinePresence.prototype.setUserOffline = function () {
        console.log('----> ' + user.name + ' is Offline');
        $('.online-' + user.id).removeClass('__active');
    };
    
    OnlinePresence.prototype.subscribePusherOnlineChannel = function () {
        var channel = this.pusher.subscribe(CHANNEL_NAME);
        var _this = this;
        
        channel.bind('pusher:subscription_succeeded', function (data) {
            
            Object.keys(data.members).forEach(function (id) {
                _this.setUserOnline(data.members[id]);
            });
        });
        channel.bind('pusher:member_added', function (data) {
            _this.setUserOnline(data);
        });
        channel.bind('pusher:member_removed', function (data) {
            _this.setUserOnline(data);
        });
    };
    
    $(document).ready(function () {
        new OnlinePresence();
    });
    
} )(window, jQuery);
