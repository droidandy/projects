;(function (window, $) {
    'use strict';

    function UserSettings() {
        this.settingInput = $('.settings-action input');
        this.disconnectButton = $('.social-button.--disconnect');

        this.bindSocialDisconnectEvents();
        this.bindSettingsEvents();
    }

    UserSettings.prototype.bindSocialDisconnectEvents = function () {
        this.disconnectButton.on('click', function (e) {
            e.preventDefault();

            $.ajax({
                url: $(this).attr('data-href'),
                method: "DELETE",
                dataType: "json",
                contentType: "application/json",
                cache: false,
                success: function (res, status, xhr) {
                    location.reload();
                }
            });
        });
    };

    UserSettings.prototype.bindSettingsEvents = function () {
        var _this = this;

        this.settingInput.on('change', function () {
            var settings = {};

            _this.settingInput.each(function () {
                settings[$(this).attr("name")] = this.checked;
            });

            $.ajax({
                url: $('.user-settings').attr('data-url'),
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(settings),
                cache: false
            });
        });
    };

    $(document).ready(function () {
        new UserSettings()
    });

})(window, jQuery);
