;(function (window, $) {
    "use strict";

    function TagAutoComplete(className) {
        this.className = className;
        this.storyTags = $(className);

        if (!this.storyTags.length) {
            return;
        }

        this.actions = {
            assigned: this.storyTags.attr('data-article-tags'),
            create: this.storyTags.attr('data-tag-create-url'),
            search: this.storyTags.attr('data-tag-search-url'),
            autocomplete: this.storyTags.attr('data-tag-autocomplete-url'),
            add: this.storyTags.attr('data-article-tag-add-url'),
            remove: this.storyTags.attr('data-article-tag-remove-url')
        };

        this.selectize = null;
        this.tagsAssigned = JSON.parse(this.actions.assigned);

        this.init();
        this.bindBackendEvents();
    }

    TagAutoComplete.prototype.init = function () {
        var _this = this;

        this.selectize = $(this.className).selectize({
            maxItems: 5,
            valueField: 'id',
            labelField: 'title',
            searchField: 'title',
            placeholder: '#Add tag',
            allowEmptyOption: true,
            persist: true,
            options: [],
            create: function (input, cb) {
                _this.search(input, cb);
            },
            load: function (query, cb) {
                _this.query(query, cb);
            },
            onInitialize: function () {

            }
        })[0].selectize;


        this.addOptions(this.tagsAssigned);
        this.setValues(this.tagsAssigned);
    };

    /**
     * @param input {string}
     * @param cb {function}
     */
    TagAutoComplete.prototype.search = function (input, cb) {
        var _this = this;

        $.ajax({
            url: _this.actions.search,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                name: input
            }),
            error: function () {
                cb();
            },
            success: function (response) {
                if (response.length) {
                    var result = JSON.parse(response);
                    var tag = {
                        id: result.id,
                        title: result.displayName
                    };

                    cb(tag);
                } else {
                    _this.create(input, cb)
                }
            }
        });
    };

    /**
     * @param input {string}
     * @param cb {function}
     */
    TagAutoComplete.prototype.create = function (input, cb) {
        var _this = this;

        $.ajax({
            url: _this.actions.create,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                displayName: input,
                private: false
            }),
            error: function () {
                cb();
            },
            success: function (response) {
                var result = JSON.parse(response);
                var tag = {
                    id: result.id,
                    title: result.displayName
                };

                cb(tag);
            }
        });
    };


    /**
     * @param query {string}
     * @param cb {function}
     */
    TagAutoComplete.prototype.query = function (query, cb) {
        var _this = this;

        if (query.length < 3) {
            return cb();
        }

        $.ajax({
            url: _this.actions.autocomplete,
            type: 'GET',
            contentType: "application/json",
            data: {
                term: query
            },
            error: function () {
                cb();
            },
            success: function (response) {
                var collection = JSON.parse(response).suggests;

                _this.addOptions(collection);

                cb();
            }
        });
    };

    /**
     * @param collection {Object}
     */
    TagAutoComplete.prototype.addOptions = function (collection) {
        var _this = this;

        collection.map(function (item) {
            var tag = {
                id: item.id,
                title: item.displayName
            };

            _this.selectize.addOption(tag);
        });
    };

    /**
     * @param collection {Object}
     */
    TagAutoComplete.prototype.setValues = function (collection) {
        var ids = collection.map(function (tag) {
            return tag.id
        });

        this.selectize.setValue(ids);
    };

    TagAutoComplete.prototype.bindBackendEvents = function () {
        var _this = this;

        this.selectize.on('item_add', function (id) {
            $.ajax({
                url: _this.actions.add,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    tag_ids: [id]
                })
            });
        });

        this.selectize.on('item_remove', function (id) {
            $.ajax({
                url: _this.actions.remove,
                method: "DELETE",
                contentType: "application/json",
                data: JSON.stringify({
                    tag_ids: [id]
                })
            });
        });
    };

    $(document).ready(function () {
        window.tagAutocomplete = new TagAutoComplete('.story-tags');
    });

})(window, jQuery);