
/**
 * some functionality related to the menu in the directory and search partials
 *
 * allow two distinct sets of functionality depending on which youre on...
 */
;(function (window, $) {
    'use strict';

    var parent = $('#searchbar');
    if (parent.length === 0) {
        return false;
    }

    parent.find('button.caret-down')
        .on('click', function (event) {
            event.preventDefault();
            parent.find('ul.nav-menu').stop().toggleClass("--display");
        })
        .on('mouseenter', function () {
            parent.find('ul.nav-menu').stop().addClass("--display");
        });

    parent.find('ul.nav-menu').on('mouseleave', function () {
        parent.find('ul.nav-menu').stop().removeClass("--display");
    });

    //allow for proper hovering by removing the currently selected item on li hover...
    parent.find('ul.nav-menu li').on('mouseenter', function () {
        parent.find('.selected').each(function () {
            $(this).addClass('_selected').removeClass('selected');
        });
    });

    //...and returning it when the user leaves the menu
    parent.on('mouseleave', function (event) {
        $(this).find('._selected').removeClass('_selected').addClass('selected');
    });

    //generic behaviour
    parent.find('ul.nav-menu li a').on('click', function (event) {
        event.preventDefault();

        $(this).parent('li').siblings().removeClass('selected').removeClass('_selected');
        $(this).parent('li').addClass('selected');
        parent.find('ul.nav-menu').removeClass("--display");
    });

    //for the normal location property search
    //update the market we are searching
    parent.find('ul#market-search-options li a').on('click', function (event) {
        event.preventDefault();

        var hidden = parent.find('input#market').stop();
        hidden.val($(this).attr('data-market'));
    });

    //for the agents search we need a slightly different set of functions
    //so just update the api we want to use and nothing else
    parent.find('ul#agent-search-options li a').on('click', function (event) {
        event.preventDefault();

        var input = parent.find('input#autocomplete').stop();
        input.focus();
        input.attr('data-api', $(this).attr('data-api'));
    });

})(window, jQuery);


/**
 * Control over the menus
 */
;(function (window, $) {
    'use strict';

    $('.nav-menu').each(function () {
        var menu = $(this);

        menu.parent()
            .mouseenter(function () {
                menu.addClass("--display");
            })
            .mouseleave(function () {
                menu.removeClass("--display");
            });
    });

    // Filter dropdowns
    $('.filter .nav-menu').each(function () {
        initMenu($(this));
    });

    function initMenu(el) { // el must be a nav-menu
        var wrapper = el.parent(),
            filterItem = wrapper.closest('.filter'),
            label = wrapper.find('> a'),
            menu = wrapper.find('> ul'),
            mainFilter = wrapper.find('.main-filter'),
            input = filterItem.find('input[data-menu-value]'),
            isNoSelect = menu.is('[data-no-select]');

        wrapper.mouseenter(function () {
                menu.addClass("--display");
                // Fix if menu is off-screen
                if (menu.offset().left < 0) {
                    menu.css({
                        left: 5,
                        right: 'initial'
                    });
                }
            })
            .mouseleave(function () {
                menu.removeClass("--display");
            });

        menu.children().click(function (e) {
            // Links -----------------------------------------------
            if ($(this).find('a').stop().hasClass('act-normal')) {
                return true;
            }

            // All normal cases ------------------------------------
            e.preventDefault();
            e.stopPropagation();

            if (isNoSelect) {
                return;
            }

            var item = $(this),
                itemValue = item.attr('data-value');

            label.html(item.find('a').html());

            if (['', 0, '0', 'rand:rand', 'all'].indexOf(itemValue) !== -1) {
                mainFilter.removeClass('selected');
            } else {
                mainFilter.addClass('selected');
            }

            input.val(itemValue).trigger('change');
            menu.children().removeClass('selected');
            item.addClass('selected');
            wrapper.mouseleave();
        });

        //run through the first element from each value and set the input value (no blank defaults)
        menu.children('.selected').each(function () {
            input.val($(this).attr('data-value'));
        });
    }

})(window, jQuery);
