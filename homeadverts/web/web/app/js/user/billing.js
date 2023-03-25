;(function (window, $) {
    "use strict";

    function Billing(containerClass) {
        this.container = $(containerClass);

        if (!this.container.length) {
            return;
        }

        this.paymentBlock = this.container.find('.payment');
        this.form = this.container.find('form');

        this.url = {
            upgradeUser: this.container.attr('data-user-upgrade'),
            downgradeUser: this.container.attr('data-user-downgrade'),
            cardUpdate: this.container.attr('data-card-update')
        };

        this.button = {
            user: {
                upgrade: this.container.find('.user-upgrade-button'),
                downgrade: this.container.find('.user-downgrade-button')
            },
            card: {
                edit: this.container.find('.edit-button'),
                save: this.container.find('.save-button'),
                cancel: this.container.find('.cancel-button')
            }
        };

        this.bindEvents();
    }

    Billing.prototype.bindEvents = function () {
        var _this = this;

        // User
        this.button.user.upgrade.click(function (e) {
            e.preventDefault();

            _this.paymentBlock.addClass('--edit');
        });
        this.button.user.downgrade.click(function (e) {
            e.preventDefault();

            _this.userDowngrade();
        });

        // Card
        this.button.card.edit.click(function (e) {
            e.preventDefault();

            _this.paymentBlock.addClass('--edit');
        });
        this.button.card.cancel.click(function (e) {
            e.preventDefault();

            _this.paymentBlock.removeClass('--edit');
        });

        //Form
        this.form.submit(function (e) {
            e.preventDefault();

            _this.cardUpdate();
        });
    };

    Billing.prototype.cardUpdate = function () {
        var _this = this;
        var data = {};
        var form = this.form.serializeArray();
        // Specially for Material select
        var countryCodeAlpha2 = this.paymentBlock.find('#countryCodeAlpha2').data('val');

        $.each(form, function (i, field) {
            data[field.name] = field.value;
        });
        data['countryCodeAlpha2'] = countryCodeAlpha2;

        dispatchNewEvent('showLoadingScreen');

        $.ajax({
            url: this.url.cardUpdate,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            error: function () {
                dispatchNewEvent('hideLoadingScreen');
            },
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Card details updated."
                });

                _this.paymentBlock.removeClass('--edit');
                dispatchNewEvent('hideLoadingScreen');
                location.reload();
            }
        });
    };

    Billing.prototype.userDowngrade = function () {
        dispatchNewEvent('showLoadingScreen');

        $.ajax({
            url: this.url.downgradeUser,
            method: "POST",
            contentType: "application/json",
            error: function () {
                dispatchNewEvent('hideLoadingScreen');
            },
            success: function (res, status, xhr) {
                window.snackbar.MaterialSnackbar.showSnackbar({
                    message: "Your account downgraded."
                });

                dispatchNewEvent('hideLoadingScreen');
                location.reload();
            }
        });
    };

    $(document).ready(function () {
        new Billing("#billing");
    });

})(window, jQuery);
