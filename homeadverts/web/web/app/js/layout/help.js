;(function (window, $) {
    "use strict";

    function Help(className) {
        this.container = $(className);

        if (!this.container.length) {
            return;
        }

        this.parent = this.container.find('.row').first();
        this.sidebar = this.container.find('.help-sidebar');
        this.content = this.container.find('.help-content');
        this.toggleOpen = this.container.find('.help-sidebar-open');
        this.toggleClose = this.container.find('.help-sidebar-close');

        this.desktopWidth = 1024;

        this.bindEvents();
        this.updateFixedSidebar();
    }

    Help.prototype.bindEvents = function () {
        $(window).on('scroll', $.proxy(this, 'updateFixedSidebar'));
        $('body').on('scroll', $.proxy(this, 'updateFixedSidebar'));
        $(window).on('resize', $.proxy(this, 'updateFixedSidebar'));
        this.toggleOpen.on('click', $.proxy(this, 'toggleSidebar'));
        this.toggleClose.on('click', $.proxy(this, 'toggleSidebar'));
        this.sidebar.find('li a').on('click', $.proxy(this, 'onClickEffect'));
    };

    Help.prototype.updateFixedSidebar = function () {
        if (!this.canSidebarMove()) {
            this.sidebar.removeAttr('style');
            return;
        }

        if (this.isDesktop()) {
            this.updateFixedSidebarLarge();
        }
    };

    Help.prototype.updateFixedSidebarLarge = function () {
        var fixedWidth = this.parent.width() * 0.25;

        this.sidebar.find('ul').css('maxHeight', '');

        if (!this.canSidebarMove()) return;

        if (this.scrollBelowSidebarTop() && this.scrollAboveSidebarBottom()) {
            this.sidebar.css({
                position: 'fixed',
                top: 0,
                width: fixedWidth
            });
        } else if (this.scrollAboveSidebarTop()) {
            this.sidebar.css({
                position: '',
                top: '',
                width: ''
            });
        } else if (this.scrollBelowSidebarBottom()) {
            this.sidebar.css({
                position: 'fixed',
                top: this.sidebarBottom() - this.currentScroll(),
                width: fixedWidth
            });
        }
    };

    Help.prototype.resizeSidebarList = function () {
        var buttonTop = this.toggle.offset().top - this.currentScroll(),
            buttonHeight = this.toggle.height(),
            buttonMargin = parseInt( this.toggle.css('margin-bottom').replace('px', '') ),
            buttonBottom = buttonTop + buttonHeight + buttonMargin,
            windowHeight = window.innerHeight;

        this.sidebar.find('ul').css('maxHeight', windowHeight - buttonBottom);
    };

    Help.prototype.toggleSidebar = function () {
        this.sidebar.toggleClass('--open');
        this.updateScrollLock();
        this.updateHeaderZIndex();
    };

    Help.prototype.onClickEffect = function () {
        if ($(window).width() < this.desktopWidth) {
            this.content.hide();
            $('.nav-header, footer').hide();
            this.toggleOpen.hide();
            this.sidebar.toggleClass('--open');
        }
    };

    Help.prototype.updateScrollLock = function () {
        if (this.sidebar.hasClass('--open')) {
            $('body').addClass('--no-scroll');
        } else {
            $('body').removeClass('--no-scroll');
        }
    };

    Help.prototype.updateHeaderZIndex = function () {
        if (this.sidebar.hasClass('--open')) {
            $('.nav-header').css({ 'z-index': '0' });
        } else {
            setTimeout(function () {
                $('.nav-header').css({ 'z-index': '' });
            }, 300);
        }
    };

    Help.prototype.canSidebarMove = function () {
        return this.sidebar.outerHeight() < this.content.outerHeight();
    };

    Help.prototype.isDesktop = function () {
        return window.innerWidth >= this.desktopWidth;
    };

    Help.prototype.currentScroll = function () {
        return $(window).scrollTop() || $('body').scrollTop();
    };

    Help.prototype.sidebarTop = function () {
        return this.parent.offset().top;
    };

    Help.prototype.sidebarBottom = function () {
        return this.parent.offset().top
            + this.parent.height()
            - this.sidebar.outerHeight();
    };

    Help.prototype.scrollAboveSidebarTop = function () {
        return this.currentScroll() < this.sidebarTop();
    };

    Help.prototype.scrollBelowSidebarTop = function () {
        return !this.scrollAboveSidebarTop();
    };

    Help.prototype.scrollAboveSidebarBottom = function () {
        return this.currentScroll() < this.sidebarBottom();
    };

    Help.prototype.scrollBelowSidebarBottom = function () {
        return !this.scrollAboveSidebarBottom();
    };

    $(document).ready(function () {
        new Help('#page-help');
    });

})(window, jQuery);
