;(function (window, $) {
    'use strict';

    function UserBio(className) {
        this.profile = $(className);

        if (!this.profile.length) {
            return;
        }

        this.about = this.profile.find('.about');
        this.aboutTrigger = this.about.find('.trigger');

        this.bindEvents();
    }

    UserBio.prototype.bindEvents = function () {
        var _this = this;

        this.aboutTrigger.on('click', function () {
            _this.about.toggleClass('--folded');
        });
    };

    $(document).ready(function () {
        new UserBio('.user-info')
    });

})(window, jQuery);
