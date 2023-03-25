;(function (window, $) {
    'use strict';

    function Sidenav (trigger) {
        this.trigger = trigger;

        if (this.trigger.hasClass('__ready')) {
            return;
        }

        this.trigger.addClass('__ready');

        this.heading = $('#sidenav .heading');
        this.close = $('#sidenav .close');
        this.menu = $('#menu');
        this.comments = $('#comments');
        this.notifications = $('#notifications');
        this.editorPublish = $('#editor-publish');
        this.message = $('#message');
        this.topics = $('#tags-to-follow');
        this.countries = $('#countries');

        this.mdlLayout = $('.mdl-layout').get(0);
        this.mdlLayoutDrawer = $('.mdl-layout__drawer');
        this.page = $('.page-container');

        this.toggleDrawerOnLoad = false;

        this.bindEvents();
    }

    Sidenav.prototype.bindEvents = function () {
        var _this = this;

        window.addEventListener('showTopicSelection', function () {
            _this.toggleDrawerOnLoad = false;
            _this.showTopicSelection();
        }, false);

        window.addEventListener('closeSideNav', function () {
            _this.closeSideNav();
        }, false);

        this.close.on('click', function () {
            _this.closeSideNav();
        });

        this.trigger.on('click', function (e) {
            e.preventDefault();
            
            var type = $(this).attr('data-type');
            _this.menu.addClass('--hidden');
            _this.notifications.addClass('--hidden');
            _this.editorPublish.addClass('--hidden');
            _this.message.addClass('--hidden');
            _this.topics.addClass('--hidden');
            _this.countries.addClass('--hidden');
            _this.comments.addClass('--hidden');

            if (type === 'navigation') {
                _this.menu.removeClass('--hidden');
                _this.heading.text(_this.menu.attr('data-heading'));
            }
            if (type === 'message') {
                _this.message.removeClass('--hidden');
                _this.heading.text(_this.message.attr('data-heading'));
            }
            if (type === 'editor') {
                _this.editorPublish.removeClass('--hidden');
                _this.heading.text(_this.editorPublish.attr('data-heading'));
            }
            if (type === 'comments') {
                _this.comments.removeClass('--hidden');
                _this.heading.text(_this.comments.attr('data-heading'));
            }
            if (type === 'notifications') {
                _this.notifications.removeClass('--hidden');
                _this.heading.text(_this.notifications.attr('data-heading'));
            }
            if (type === 'countries-internal') {
                _this.countries.removeClass('--hidden');
                _this.heading.text(_this.countries.attr('data-heading'));

                return false;
            }
            if (type === 'categories-internal') {
                _this.topics.removeClass('--hidden');
                _this.heading.text(_this.topics.attr('data-heading'));

                return false;
            }
            if (type === 'notifications-internal') {
                _this.notifications.removeClass('--hidden');
                _this.heading.text(_this.notifications.attr('data-heading'));

                return false;
            }

            if (_this.mdlLayout.MaterialLayout) {
                _this.mdlLayout.MaterialLayout.toggleDrawer();
            } else {
                _this.toggleDrawerOnLoad = true;
            }

            Scroll.updateLock();
        });

        $(window).on('load', function () {
            if (_this.toggleDrawerOnLoad) {
                _this.mdlLayout.MaterialLayout.toggleDrawer();
            }
        });

        this.page.on('click', '.mdl-layout__obfuscator', function () {
            Scroll.updateLock();
        });
    };

    Sidenav.prototype.showTopicSelection = function () {
        this.menu.addClass('--hidden');
        this.notifications.addClass('--hidden');
        this.editorPublish.addClass('--hidden');
        this.countries.addClass('--hidden');
        this.comments.addClass('--hidden');
        this.message.addClass('--hidden');
        this.topics.removeClass('--hidden'); // Init topics selection.

        this.mdlLayout.MaterialLayout.toggleDrawer();
        this.mdlLayoutDrawer.addClass('--locked');
    };

    Sidenav.prototype.closeSideNav = function () {
        this.mdlLayoutDrawer.removeClass('--locked');
        this.mdlLayout.MaterialLayout.toggleDrawer();

        Scroll.updateLock();
    };

    var boot = function () {
        var triggers = $('.sidenav-show');

        triggers.map(function (i, trigger) {
            new Sidenav($(trigger));
        });
    };

    $(document).ready(function () {
        boot();
    });

    window.addEventListener('paginationUpdated', boot, false);

})(window, jQuery);
