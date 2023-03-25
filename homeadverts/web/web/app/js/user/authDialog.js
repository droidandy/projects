;( function (window, $) {
    'use strict';
    
    function AuthDialog (className) {
        this.dialog = $(className);
        
        if (!this.dialog.length) {
            return;
        }
        this.authButton = $('.auth-show');
        
        this.loginForm = this.dialog.find('.login-form');
        this.socialSignupButton = this.dialog.find('.sign-up-social a');
        this.loginFormSwichView = this.loginForm.find('.button-switch-view');
        this.loginFormSwichViewToManual = this.loginForm.find(
            '.button-switch-view-to-manual');
        
        this.loginManualForm = this.dialog.find('.login-manual-form');
        this.loginManualFormSwichView = this.loginManualForm.find(
            '.button-switch-view');
        this.loginManualFormSubmit = this.loginManualForm.find(
            '.actions button');
        
        this.registerForm = this.dialog.find('.register-form');
        this.registerFormSwichView = this.registerForm.find(
            '.button-switch-view');
        this.registerFormSwichViewToManual = this.registerForm.find(
            '.button-switch-view-to-manual');
        
        this.registerManualForm = this.dialog.find('.register-manual-form');
        this.registerManualFormSwichView = this.registerManualForm.find(
            '.button-switch-view');
        this.registerManualFormSubmit = this.registerManualForm.find(
            '.actions button');
        
        this.closeButton = this.dialog.find('.close');
        this.url = {
            login: this.dialog.attr('data-url-login'),
            register: this.dialog.attr('data-url-register'),
        };
        
        this.initDialogEvents();
        this.initViewEvents();
        this.initActions();
    }
    
    AuthDialog.prototype.initDialogEvents = function () {
        var _this = this;
        
        // Modal dialog actions
        if (!this.dialog[0].showModal) {
            _this.showLoginForm();
            dialogPolyfill.registerDialog(this.dialog[0]);
        }
        
        this.closeButton.on('click', function () {
            _this.dialog[0].close();
        });
        
        _this.dialog[0].addEventListener('click', function (event) {
            var rect = _this.dialog[0].getBoundingClientRect();
            var isInDialog = (
                rect.top <= event.clientY
                && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX
                && event.clientX <= rect.left + rect.width
            );
            
            if (!isInDialog) {
                _this.dialog[0].close();
            }
        });
        
        // Listeners
        window.addEventListener('authNeeded', function () {
            _this.showLoginForm();
            _this.dialog[0].showModal();
            dispatchNewEvent(_this.dialog[0], 'showModal');
        }, false);
        
        this.authButton.on('click', function (e) {
            e.preventDefault();
            _this.showLoginForm();
            _this.dialog[0].showModal();
            dispatchNewEvent(_this.dialog[0], 'showModal');
        });
    };
    
    AuthDialog.prototype.initActions = function () {
        var _this = this;
        
        this.loginManualForm.find('.email, .password')
            .on('keydown', function (e) {
                if (e.which === 13) {
                    _this.loginManualFormSubmit.trigger('click');
                }
            });
        
        this.registerManualForm.find('.email, .password')
            .on('keydown', function (e) {
                if (e.which === 13) {
                    _this.registerManualFormSubmit.trigger('click');
                }
            });
        
        this.loginManualFormSubmit.on('click', function (e) {
            e.preventDefault();
            var email = _this.loginManualForm.find('.email').val();
            var password = _this.loginManualForm.find('.password').val();
            
            _this.login(email, password);
        });
        
        this.registerManualFormSubmit.on('click', function (e) {
            e.preventDefault();
            _this.register();
        });
        
        this.socialSignupButton.on('click', function (e) {
            $(this).attr('disabled', 'disabled');
        });
    };
    
    AuthDialog.prototype.initViewEvents = function () {
        var _this = this;
        
        // Login: social
        this.loginFormSwichView.on('click', function (e) {
            e.preventDefault();
            _this.showRegisterForm();
        });
        this.loginFormSwichViewToManual.on('click', function (e) {
            e.preventDefault();
            _this.showLoginManualForm();
        });
        // Login: manual
        this.loginManualFormSwichView.on('click', function (e) {
            e.preventDefault();
            _this.showLoginForm();
        });
        // Register: social
        this.registerFormSwichView.on('click', function (e) {
            e.preventDefault();
            _this.showLoginForm();
        });
        this.registerFormSwichViewToManual.on('click', function (e) {
            e.preventDefault();
            _this.showRegisterManualForm();
        });
        // Register: manual
        this.registerManualFormSwichView.on('click', function (e) {
            e.preventDefault();
            _this.showLoginForm();
        });
    };
    
    AuthDialog.prototype.showLoginForm = function () {
        this.registerForm.hide();
        this.loginManualForm.hide();
        this.registerManualForm.hide();
        
        this.loginForm.show();
    };
    AuthDialog.prototype.showRegisterForm = function () {
        this.loginForm.hide();
        this.loginManualForm.hide();
        this.registerManualForm.hide();
        
        this.registerForm.show();
    };
    AuthDialog.prototype.showRegisterManualForm = function () {
        this.registerForm.hide();
        this.loginForm.hide();
        this.loginManualForm.hide();
        
        this.registerManualForm.show();
        this.registerManualForm.find('.email').focus();
    };
    AuthDialog.prototype.showLoginManualForm = function () {
        this.registerForm.hide();
        this.loginForm.hide();
        this.registerManualForm.hide();
        
        this.loginManualForm.show();
        this.loginManualForm.find('.email').focus();
    };
    
    AuthDialog.prototype.login = function (email, password) {
        var _this = this;
        
        if (email && password) {
            this.loginManualFormSubmit.attr('disabled', 'disabled');
            
            $.ajax({
                url: this.url.login,
                dataType: 'json',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    password: password,
                }),
                success: function () {
                    location.reload();
                },
                error: function () {
                    _this.loginManualFormSubmit.removeAttr('disabled');
                },
            });
        }
    };
    
    AuthDialog.prototype.register = function () {
        var _this = this;
        
        var email = this.registerManualForm.find('.email').val();
        var password = this.registerManualForm.find('.password').val();
        
        if (email) {
            this.registerManualFormSubmit.attr('disabled', 'disabled');
            
            $.ajax({
                url: this.url.register,
                dataType: 'json',
                method: 'POST',
                data: JSON.stringify({
                    email: email,
                    username: email,
                    name: email,
                    plainPassword: password,
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-User-Agreement', 'Yes');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },
                statusCode: {
                    201: function () {
                        _this.login(email, password);
                    },
                },
                error: function () {
                    _this.registerManualFormSubmit.removeAttr('disabled');
                },
            });
        }
    };
    
    $(document).ready(function () {
        new AuthDialog('.auth-dialog');
    });
    
} )(window, jQuery);
