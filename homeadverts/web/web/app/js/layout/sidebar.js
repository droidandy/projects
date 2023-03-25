;(function (window, $) {
    'use strict';

    function Sidebar() {
        this.open = false;
        this.level = 0;
        this.levelSpacing = 30;

        this.menu = $('#sidebar-menu');
        this.form = $("#sidebar-filters").children('form');
        this.trigger = $('.filters-show');
        this.page = $('.page-container');
        this.body = $('body');

        this._init();
    }

    Sidebar.prototype = {
        _init: function () {
            var _this = this;
            this.levels = this.menu.find('.mp-level');
            this.levels.each(function (i, el) {
                el.setAttribute('data-level', _this._getLevelDepth(el, _this.menu.attr('id'), 'mp-level'));
            });
            this.menuItems = this.menu.find('li');
            this._initEvents();
        },
        _getLevelDepth: function (e, id, waypoint, cnt) {
            cnt = cnt || 0;
            if (e.id.indexOf(id) >= 0) return cnt;
            if ($(e).hasClass(waypoint)) {
                ++cnt;
            }
            return e.parentNode && this._getLevelDepth(e.parentNode, id, waypoint, cnt);
        },
        _initEvents: function () {
            var _this = this;

            // the menu should close if clicking somewhere on the body
            var bodyClickFn = function (el) {
                _this._resetMenu();
                el.removeEventListener('click', bodyClickFn);
            };

            // open (or close) the menu
            this.trigger.on('click', function (event) {
                event.stopPropagation();
                event.preventDefault();

                if (_this.open) {
                    _this._resetMenu();
                } else {
                    _this._openMenu();
                    // the menu should close if clicking somewhere on the body (excluding clicks on the menu)
                    $(document).on('click', function (event) {
                        if (_this.open && !$(event.target).parents("#"+_this.menu.attr('id')).length) {
                            bodyClickFn(this);
                        }
                    });
                }
            });

            // ====== Reset All ======
            $(".reset-and-close").on('click', function () {
                _this._filtersAllResetAndCloseMenu();
            });

            // ===== Map Switch =====
            $("#map-view-switch").on('change', function () {
                _this._mapViewToggle(this.checked);
            });

            // ===== Reset Filter =====
            $(".reset-button").on('click', function () {
                var item = $(this).parent('.item');
                _this._filterReset(item);

                event.preventDefault();
                event.stopPropagation();
            });

            // ===== Select Filter =====
            $(".menu-filter").on('click', function () {
                _this._filterSelect($(this));

                event.preventDefault();
                event.stopPropagation();
            });

            // ====== Menu Levels =====
            this.menuItems.each(function (i, element) {
                var el = $(element);
                var subLevel = el.children('.mp-level');

                el.children('.item, a').on('click', function (event) {
                    var level = subLevel.attr('data-level');

                    if ((_this.level < level)) {
                        event.preventDefault();
                        event.stopPropagation();
                        el.closest('.mp-level').addClass('mp-level-overlay');
                        _this._openMenu(subLevel);
                    }
                });
            });

            // closing the sub levels :
            // by clicking on the visible part of the level element
            this.levels.each(function (i, element) {
                var el = $(element);

                el.on('click', function (event) {
                    event.stopPropagation();
                    var level = el.attr('data-level');

                    if (_this.level > level) {
                        _this.level = level;
                        _this._closeMenu();
                    }
                });
            });
        },
        _openMenu: function (subLevel) {
            ++this.level;

            this.trigger.addClass('is-active');
            this.page.addClass('--pushed');

            // add class --pushed to main wrapper if opening the first time
            if (this.level === 1) {
                this.open = true;
            }

            this._setTransform();
            this._updateScroll(true);

            if (subLevel) {
                $(subLevel).addClass('mp-level-open');
            }
        },

        // close the menu
        _resetMenu: function () {
            this.open = false;
            this.level = 0;
            this._setTransform();
            this._toggleLevels();
            this._updateScroll(false);
            this.trigger.removeClass('is-active');
            this.page.removeClass('--pushed');
        },

        // close sub menus
        _closeMenu: function () {
            this._setTransform();
            this._toggleLevels();
            this._updateScroll(false);
        },
        _setTransform: function () {
            var menuOffset = (this.level-1) * this.levelSpacing;
            var pageOffset = this.menu.width() + menuOffset;

            if (this.level) {
                this.page.css({
                    'transform': 'translateX('+pageOffset+'px)'
                });
                this.menu.css({
                    'transform': 'translateX('+menuOffset+'px)'
                });
            } else {
                this.menu.removeAttr('style');
                this.page.removeAttr('style');
            }
        },
        // removes classes mp-level-open from closing levels
        _toggleLevels: function () {
            for (var i = 0, len = this.levels.length; i < len; ++i) {
                var levelEl = this.levels[i];

                if (levelEl.getAttribute('data-level') >= this.level + 1) {
                    $(levelEl).removeClass('mp-level-open');
                    $(levelEl).removeClass('mp-level-overlay');
                } else if (Number(levelEl.getAttribute('data-level')) == this.level) {
                    $(levelEl).removeClass('mp-level-overlay');
                }
            }
        },
        _preventDefault: function (e) {
            e.preventDefault();
        },
        _updateScroll: function (active) {
            if (active && !this.body.hasClass('--no-scroll')) {
                this.body.addClass('--no-scroll');
                this.page.on('touchmove', this._preventDefault);
            } else if (!active && this.body.hasClass('--no-scroll')) {
                this.body.removeClass('--no-scroll');
                this.page.off('touchmove', this._preventDefault);
            }
        },
        _filtersAllResetAndCloseMenu: function () {
            var filters = this.form.serialize().replace(/[^&]+=\.?(?:&|$)/g, '');
            var itemsToUpdate = $('#sidebar-filters .item.reset-filter');
            var filterToUpdate = $('#sidebar-filters .filter-value');

            if (filters) {
                // Reset labels
                itemsToUpdate.each(function (i, item) {
                    $(item).find('.filter-label').text($(item).attr('data-default-label'));
                });
                // Hide reset buttons
                itemsToUpdate.removeClass('reset-filter');
                // Hide reset values
                filterToUpdate.val("");
                $('.video-switch').get(0).MaterialSwitch.off();
                $('.filter-value[name="filters[video]"]').trigger('change');
            }

            // Close menu
            this._resetMenu();
        },
        _filterReset: function (item) {
            var name = item.attr('data-name');
            var value = item.attr('data-default-value');
            var label = item.attr('data-default-label');
            var container = item.closest('.filter-mobile');
            var labelsToUpdate = container.find('.filter-label[data-name="'+name+'"]');
            var filterToUpdate = container.find('.filter-value[name="'+name+'"]');

            labelsToUpdate.text(label);
            filterToUpdate.val(value).trigger('change');
            item.removeClass('reset-filter').blur();
        },
        _mapViewToggle: function (checked) {
            $(document).trigger('collection-map-view-changed');

            // Close menu
            this._resetMenu();
        },
        _filterSelect: function (item) {
            var text = item.text();
            var name = item.attr('data-name');
            var value = item.attr('data-value');
            var container = item.closest('.filter-mobile');
            var itemsToUpdate = container.find('.item[data-name="'+name+'"]');
            var labelsToUpdate = container.find('.filter-label[data-name="'+name+'"]');
            var filterToUpdate = container.find('.filter-value[name="'+name+'"]');

            itemsToUpdate.addClass('reset-filter');
            labelsToUpdate.text(text);
            filterToUpdate.val(value).trigger('change');

            this.level--;
            this._closeMenu();
        }
    };

    $(document).ready(function () {
        new Sidebar();
    });


})(window, jQuery);
