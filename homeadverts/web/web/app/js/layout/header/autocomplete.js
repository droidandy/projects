;(function (window, $) {
    "use strict";

    function Search() {
        this.xhrCall = null;
        this.answersWithResults = 0;
        this.activeItem = -1;
        this.termMinLength = 3;

        if (window.innerWidth > 768) {
            this.headerHeight = 80;
            this.searchHeight = 50;
        } else {
            this.headerHeight = 60;
            this.searchHeight = 50;
        }

        this.searchWrapperClass = '.search-wrapper';
        this.searchResultsClass = '.search-results';

        this.autocompleteSelected = this.autocomplete;

        this.header = $('.nav-header');
        this.autocomplete = $('.autocomplete');
        this.searchWrapper = $(this.searchWrapperClass);
        this.searchResults = $(this.searchResultsClass);
        this.searchPopular = $('.search-popular');

        this.progressBar = $('.search-progress');
        this.searchRow = $('.search-row');

        this.searchForm = this.autocomplete.parents('form').stop();
        this.placeReference = this.searchForm.find('input#reference').stop();

        this.html = $('html');

        this._translate = [];
        this._translate['id'] = "ID";

        this._translate['listings'] = this.autocomplete.attr('data-translate-listings');
        this._translate['by'] = this.autocomplete.attr('data-translate-by');
        this._translate['and'] = this.autocomplete.attr('data-translate-and');
        this._translate['agents'] = this.autocomplete.attr('data-translate-agents');
        this._translate['businesses'] = this.autocomplete.attr('data-translate-businesses');
        this._translate['affiliates'] = this.autocomplete.attr('data-translate-affiliates');
        this._translate['articles'] = this.autocomplete.attr('data-translate-articles');

        this._translate['properties'] = this.autocomplete.attr('data-translate-properties');
        this._translate['location'] = this.autocomplete.attr('data-translate-location');
        this._translate['agent'] = this.autocomplete.attr('data-translate-agent');
        this._translate['business'] = this.autocomplete.attr('data-translate-business');
        this._translate['article'] = this.autocomplete.attr('data-translate-article');
        this._translate['tag'] = this.autocomplete.attr('data-translate-tag');
        this._translate['mls'] = this.autocomplete.attr('data-translate-mls');
        this._translate['ref'] = this.autocomplete.attr('data-translate-ref');
        this._translate['guid'] = this.autocomplete.attr('data-translate-guid');
        this._translate['zip'] = this.autocomplete.attr('data-translate-zip');
        this._translate['bad_search'] = this.autocomplete.attr('data-translate-badsearch');
        this._translate['no_results'] = this.autocomplete.attr('data-translate-nothingfound');
        this._translate['show_all'] = this.autocomplete.attr('data-translate-show-all');

        this.articleResultsUrl = this.autocomplete.attr('data-article-search-result-url');
        this.tagDetailsUrl = this.autocomplete.attr('data-tag-details-url');

        this.hideAutocomplete();
        this.bindKeys();
    }

    Search.prototype.bindKeys = function () {
        var _this = this,
            isTouch = $('html').hasClass('touch');

        this.header.click(function (e) {
            if (!_this.header.hasClass('--show-search')) {
                return;
            }

            if (e.clientY < _this.headerHeight + _this.searchHeight) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (isTouch) {
                if (e.clientY > _this.headerHeight && e.clientY < _this.headerHeight + _this.searchHeight) {
                    _this.searchRow.find('input').focus();
                } else {
                    _this.resetSearchFormAndHideAutocomplete();
                }
            } else {
                if (e.target.nodeName !== 'INPUT') {
                    _this.resetSearchFormAndHideAutocomplete();
                }
            }
        });

        this.autocomplete
            .on('focus', function () {
                _this.header.addClass('--focus-search');
                _this.showAutocomplete('popular');
            })
            .on('blur', function () {
                _this.header.removeClass('--focus-search');
            });

        $(document).keyup(function (e) {
            // Listen to escape key globally
            if (e.which == 27) {
                _this.resetSearchFormAndHideAutocomplete();
            }
        });

        this.autocomplete
            .on('focus', $.proxy(this, 'focusAutocomplete'))
            .on('keyup', $.proxy(this, 'keyboardControls'))
            .on('keyup', $.proxy(this, 'inputTriggerSearch'))
            .on('paste', $.proxy(this, 'pasteTriggerSearch'));

        this.searchForm.on('submit', $.proxy(this, 'submitSearchForm'));

        /**
         * Active result item should follow mouse cursor
         *
         * @param  {event} e
         * @return {void}
         */
        this.searchWrapper.on('mouseover', function (e) {
            var list = $(_this.searchWrapperClass + ' li.result-item'),
                index = list.index( $(_this.searchWrapperClass + ' li.result-item:hover').get(0) );

            _this.resetSelect(list, index);
            _this.moveSelectTo(list, 0);
        });

        /**
         * register a 'live' onclick for all result list items - update value, trigger submit
         *
         * @param  {event} e
         * @return {void}
         */
        $('body').on('click', this.searchResultsClass + ' li a', function (e) {
            e.stopPropagation();

            var item = $(this);
            var url = item.data('url');
            var type = item.data('type');
            var location = item.data('location');
            var reference = item.data('reference');

            if (type == "location" || type == "zip") {
                _this.setSearch(location, reference);
                _this.searchForm.trigger('submit');
            } else {
                window.location = url;
            }
        });
    };

    /**
     * track whether the field has focus, we shouldn't process any results if the field no longer has focus
     *
     * @param {Object} e
     * @return {void}
     */
    Search.prototype.focusAutocomplete = function (e) {
        this.autocompleteSelected = $(e.target);

        this.resetSelect(this.searchWrapper.find('li.result-item'));
    };

    /**
     * Deal with keyboard navigation on search results
     *
     * @param {Object} e - event object
     * @return {void}
     */
    Search.prototype.keyboardControls = function (e) {
        var list = $(this.searchWrapperClass).find('li.result-item');

        if (list.length === 0) {
            return;
        }

        switch (e.which) {
            //default would be to keep typing
            //so reset the pointer to 0
            default :
                this.resetSelect(list);
                return;

            // up
            case 38 :
                e.preventDefault();
                this.moveSelectTo(list, -1);
                this.setSearchToCurrent(list);
                return;

            // down
            case 40 :
                e.preventDefault();
                this.moveSelectTo(list, 1);
                this.setSearchToCurrent(list);
                return;
        }
    };

    /**
     * Keyboard input triggers search if needed
     *
     * @param {Object} e
     * @return {void}
     */
    Search.prototype.inputTriggerSearch = function (e) {
        // Verify _this the key entered is not a special key
        // Caps lock, Shift, Control Key, Windows Command Key, Pause Break, Alt Key,
        // Right Click Point Key, Home, End, Arrow Keys, Num Lock, Scroll Lock
        if ($.inArray(e.which, [20, 16, 17, 91, 19, 18, 93, 35, 40, 45, 33, 34, 144, 145]) >= 0) {
            return;
        }

        //check for keycodes, navigation is dealt with seperately above
        // left, up, right, down, tab, return, escape
        if ($.inArray(e.which, [37, 38, 39, 40, 9, 13, 27]) >= 0) {
            return;
        }

        if (this.getAutocompleteValue().length >= this.termMinLength) {
            this.triggerSearch(this.getAutocompleteValue());
        } else if (this.getAutocompleteValue().length > 0) {
            this.hideAutocomplete();

            if (this.xhrCall) {
                this.xhrCall.abort();
                this.xhrCall = null;
            }
        }

        if (this.getAutocompleteValue().length === 0 ) {
            this.showAutocomplete('popular');
        }
    };

    /**
     * Pasting into search field triggers search
     *
     * @return {void}
     */
    Search.prototype.pasteTriggerSearch = function () {
        var _this = this;

        setTimeout(function () {
            _this.triggerSearch(_this.getAutocompleteValue());
        }, 10);
    };

    /**
     * @return {String}
     */
    Search.prototype.getAutocompleteValue = function () {
        return this.autocompleteSelected.val();
    };

    /**
     * @param  {String} input
     * @return {void}
     */
    Search.prototype.triggerSearch = function (input) {
        if (input === undefined || input.length < this.termMinLength) {
            return false;
        }

        var _this = this;

        if (this.xhrCall){
            this.xhrCall.abort();
        }

        this.xhrCall = $.ajax({
            url: this.autocomplete.data('url'),
            method: "POST",
            data: JSON.stringify({
                term: input
            }),
            contentType: "application/json",
            cache: false,
            beforeSend: function () {
                _this.progressBar.addClass('mdl-progress__indeterminate --shown');
            },
            success: function (results) {
                _this.xhrCall = null;
                _this.answersWithResults = 0;

                var articleResultsUrl = _this.articleResultsUrl.replace("__TERM__", input);

                var id = _this.transformPropertyResults(results, "id");
                var zip = _this.transformPropertyResults(results, "zip");
                var mls = _this.transformPropertyResults(results, "mls");
                var ref = _this.transformPropertyResults(results, "ref");
                var guid = _this.transformPropertyResults(results, "guid");
                var location = _this.transformLocationResults(results, "location");
                var article = _this.transformArticleResults(results, "article");
                var tag = _this.transformTagResults(results, "tag");
                var agent = _this.transformAgentResults(results, "agent", "person");
                var business = _this.transformAgentResults(results, "business", "business");

                _this.generateSearchResults("id", id, '');
                _this.generateSearchResults("zip", zip, '');
                _this.generateSearchResults("mls", mls, '');
                _this.generateSearchResults("ref", ref, '');
                _this.generateSearchResults("guid", guid, '');
                _this.generateSearchResults("location", location, '');
                _this.generateSearchResults("article", article, articleResultsUrl);
                _this.generateSearchResults("tag", tag, '');
                _this.generateSearchResults("agent", agent, '');
                _this.generateSearchResults("business", business, '');
            },
            error: function (e) {
                if (e.statusText !== 'abort') {
                }

                _this.progressBar.removeClass('mdl-progress__indeterminate --shown');
            },
            complete: function () {
                _this.progressBar.removeClass('mdl-progress__indeterminate --shown');
            }
        });
    };

    /**
     * @param  {Array} results
     * @param  {string} type
     * @return  {Array} results
     */
    Search.prototype.transformPropertyResults = function (results, type) {
        if (results[type].total > 0) {
            this.answersWithResults++;
        }
        results[type].items = $.map(results[type].items, function (item) {
            var location = item[type] + ", " + item.address;
            item = {
                type: type,
                location: location,
                details: item.agent.details.name + ", " + item.agent.details.companyName,
                url: item.url
            };

            return item;
        });

        return results[type];
    };

    /**
     * @param  {Array} results
     * @param  {string} type
     * @return  {Array} results
     */
    Search.prototype.transformLocationResults = function (results, type) {
        var _this = this;
        if (results[type].total > 0) {
            this.answersWithResults++;
        }
        results[type].items = $.map(results[type].items, function (item) {
            return {
                type: type,
                location: item.title,
                url: item.url,
                icon: 'location_on',
                details:
                "<a href='"+item.properties.sale.url+_this.displayMap()+"'>"
                    +item.properties.sale.total+" "+_this._translate['listings']+" "+
                "</a>"+
                "<a href='"+item.agents.url+_this.displayMap()+"'>"
                    +_this._translate['by']+" "+item.agents.total+" "+_this._translate['agents']+" "
                +"</a>"+
                "<a href='"+item.businesses.url+_this.displayMap()+"'>"
                    +_this._translate['and']+" "+item.businesses.total+" "+_this._translate['businesses']
                +"</a>"
            };
        });

        return results[type];
    };

    /**
     * @param  {Array} results
     * @param  {string} type
     * @return  {Array} results
     */
    Search.prototype.transformArticleResults = function (results, type) {
        if (results[type].total > 0) {
            this.answersWithResults++;
        }

        results[type].items = $.map(results[type].items, function (item) {
            return {
                type: type,
                location: item.title,
                url: item.url,
                icon: 'library_books',
                details: item.details
            };
        });

        return results[type];
    };

    /**
     * @param  {Array} results
     * @param  {string} type
     * @return  {Array} results
     */
    Search.prototype.transformTagResults = function (results, type) {
        var _this = this;
        if (results[type].total > 0) {
            this.answersWithResults++;
        }

        results[type].items = $.map(results[type].items, function (item) {
            item = {
                type: type,
                location: item.displayName,
                icon: 'label',
                url: _this.tagDetailsUrl.replace("__NAME__", item.name)
            };

            return item;
        });

        return results[type];
    };

    /**
     * @param  {Array} results
     * @param  {string} type
     * @return  {Array} results
     */
    Search.prototype.transformAgentResults = function (results, type, icon) {
        var _this = this;
        if (results[type].total > 0) {
            this.answersWithResults++;
        }

        results[type].items = $.map(results[type].items, function (item) {
            var details = ['agents', 'affiliates', 'properties', 'articles']
                .map(
                    function (el) {
                        if (item[el]) {
                            return item[el] + " " + _this._translate[el];
                        } else {
                            return null;
                        }
                    }
                )
                .filter(function (el) {
                    return el != null;
                })
                .join(', ')
            ;

            item = {
                type: type,
                location: item.title,
                url: item.url,
                icon: icon,
                address: item.address,
                details: details
            };

            return item;
        });

        return results[type];
    };

    /**
     * @param  {String} type
     * @param  {Array} results
     * @param  {string} viewMoreUrl
     * @return {void}
     */
    Search.prototype.generateSearchResults = function (type, results, viewMoreUrl) {
        var html = this.populateSearch(type, results, viewMoreUrl);

        this.searchResults.find(this.searchResultsClass+"-" + type).html(html);

        if (this.answersWithResults > 0) {
            this.showAutocomplete('results');
        } else {
            this.hideAutocomplete();
        }
    };

    /**
     * @param  {String} type
     * @param  {Array} results
     * @param  {string} viewMoreUrl
     * @return {Node}
     */
    Search.prototype.populateSearch = function (type, results, viewMoreUrl) {
        var _this = this;
        var html = document.createElement('ul');
        var term = this.getAutocompleteValue();

        $.each(results.items, function (i, result) {
            var location = result.location.replace(/&amp;/g, '&');
            var li = document.createElement('li');

            li.classList.add('result-item');

            var icon = document.createElement('i');
            icon.setAttribute('class', 'material-icons');
            icon.innerHTML = result.icon;

            var a = document.createElement('a');
            a.innerHTML = location.highlightTerm(term);
            a.setAttribute('href', result.url+_this.displayMap());

            var link = document.createElement('div');
            link.setAttribute('class', 'link');
            link.appendChild(a);
            link.appendChild(icon);

            if (result.address) {
                var address = document.createElement('span');
                address.setAttribute('class', 'details');
                address.innerHTML = result.address;
                link.appendChild(address);
            }

            if (result.details) {
                var details = document.createElement('span');
                details.setAttribute('class', 'details');
                details.innerHTML = result.details;
                link.appendChild(details);
            }

            if (!result.address && !result.details) {
                li.classList.add('--small');
            }

            if (i === 0) {
                var kind = document.createElement('span');
                kind.setAttribute('class', 'search-kind');
                kind.innerHTML = _this._translate[type];
                link.appendChild(kind);
            }

            link.setAttribute('data-type', result.type);
            link.setAttribute('data-location', result.location);
            li.appendChild(link);

            if (i === results.items.length - 1) {
                li.classList.add('--separator');

                if (viewMoreUrl) {
                    var viewMore = document.createElement('a');

                    viewMore.setAttribute('href', viewMoreUrl);
                    viewMore.setAttribute('class', 'link --view-more');
                    viewMore.innerHTML = _this._translate['show_all'];

                    li.appendChild(viewMore);
                }
            }
            html.appendChild(li);
        });

        return html;
    };

    /**
     * Helper method to move the active element
     *
     * @param  {Object} list A jQuery object containing the list to manipulate
     * @param  {int} step Plus numbers move down, Minus numbers move up
     * @return {void}
     */
    Search.prototype.moveSelectTo = function (list, step) {
        this.activeItem += step;

        if (this.activeItem < 0) {
            this.activeItem = 0;

        } else if (this.activeItem >= list.size()) {
            this.activeItem = list.size() - 1;
        }

        list.removeClass("active");
        $(list[this.activeItem]).addClass("active");
    };

    /**
     * reset the active item to be the first in the list
     *
     * @param  {Object} list A jQuery object containing the list to manipulate
     * @param  {int} index
     * @return {void}
     */
    Search.prototype.resetSelect = function (list, index) {
        this.activeItem = index || 0;
        list.removeClass('active');
    };

    /**
     * returns the currently active list item
     *
     * @param  {Object} list An object containing list elements
     * @return {Object|Boolean}
     */
    Search.prototype.getCurrentListItem = function (list) {
        var result = list.filter('.active').first();

        if (result.length) {
            return result;
        } else {
            return false;
        }
    };

    Search.prototype.setSearchToCurrent = function (list) {
        var currentListItem = this.getCurrentListItem(list);

        //if there is not currently selected item, set to the first element in list
        if (!currentListItem) {
            currentListItem = list.first();
        }

        var a = currentListItem.find('a').stop();
        var value = a.data('location');
        var ref = a.data('reference');

        //if the value is an error message, reset everything
        if ($.inArray(value, [this._no_results, this._bad_search]) >= 0) {
            this.placeReference.val('');
        } else {
            this.setSearch(value, ref);
        }
    };

    Search.prototype.setSearch = function (value, referenceId) {
        referenceId = referenceId || "";

        this.placeReference.val(referenceId);
        this.autocomplete.val(value);
    };

    Search.prototype.showAutocomplete = function (type) {
        var _this = this;

        this.searchResults.hide();
        this.searchPopular.hide();

        if (type === 'results') {
            this.searchResults.show();
        } else {
            this.searchPopular.show();
        }

        this.searchWrapper.show();
        this.searchWrapper.scrollTop(0);

        this.moveSelectTo(this.searchWrapper.find('li.result-item'), 0);

        setTimeout(function () {
            _this.header.addClass('--show-search');
        }, 0);

        this.html.stop().animate({
            scrollTop: 0
        }, 400);
        Scroll.updateLock();
    };

    Search.prototype.hideAutocomplete = function () {
        var _this = this;

        // Allow hide animation to complete
        setTimeout(function () {
            _this.searchResults.find(_this.searchResultsClass+"-location").html("");
            _this.searchResults.find(_this.searchResultsClass+"-agent").html("");
            _this.searchResults.find(_this.searchResultsClass+"-business").html("");
            _this.searchResults.find(_this.searchResultsClass+"-article").html("");
            _this.searchResults.find(_this.searchResultsClass+"-tag").html("");
            _this.searchResults.find(_this.searchResultsClass+"-zip").html("");
            _this.searchResults.find(_this.searchResultsClass+"-mls").html("");
            _this.searchResults.find(_this.searchResultsClass+"-ref").html("");
            _this.searchResults.find(_this.searchResultsClass+"-guid").html("");
            _this.searchResults.find(_this.searchResultsClass+"-id").html("");

            _this.searchResults.hide();
            _this.searchPopular.hide();
            _this.searchWrapper.hide();
        }, 300);

        this.header.removeClass('--show-search');
        Scroll.updateLock();
    };

    /**
     * Hide search results and reset search field
     *
     * @return {void}
     */
    Search.prototype.resetSearchFormAndHideAutocomplete = function () {
        this.hideAutocomplete();
        this.setSearch('');
    };

    /**
     * Redirect to selected result item
     *
     * @param {Object} e
     * @return {void}
     */
    Search.prototype.submitSearchForm = function (e) {
        e.preventDefault();

        if (this.answersWithResults > 0) {
            var newLocation = this.searchResults.find('.result-item.active a').attr('href');

            if (newLocation) {
                window.location = newLocation;
            }
        }
    };

    String.prototype.highlightTerm = function (term) {
        return this.replace(
            new RegExp("/" + term + "/", 'gi'), '<strong>$&</strong>'
        );
    };

    Search.prototype.displayMap = function () {
        var params = {};
        var map = "";

        window.location.href.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function($0, $1, $2, $3) {
                params[$1] = $3;
            }
        );

        if (params['map'] == 1) {
            map = "?map=1";
        }

        return map;
    };

    // Initialize search
    new Search();

})(window, jQuery);
