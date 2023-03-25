;(function (window, $) {
    "use strict";

    var templates = {};

    templates.line = '<p><br></p>';

    templates.images = function (className, content) {
        return '<div class="' + className + '" contenteditable="false">' + content + '</div>';
    };

    templates.image = function (img, name) {
        return '<figure data-image="' + name + '" contenteditable="false"><img src="' + img + '" alt=""></figure>';
    };

    templates.caption = function (placeholder, content) {
        content = content || '';
        return '<textarea class="media-caption" placeholder="' + placeholder + '">' + content + '</textarea>';
    };

    templates.buttons = function (addons) {
        var buttons = '';

        for (var k in addons) {
            buttons = buttons +
                '<li><button data-addon="' + k + '" data-action="add" class="medium-insert-action" type="button">'
                + addons[k].label +
                '</button></li>';
        }

        return '<div class="medium-insert-buttons" contenteditable="false" style="display: none">' +
            '<button class="medium-insert-buttons-show" type="button"></button>' +
            '<ul class="medium-insert-buttons-addons">' + buttons + '</ul>' +
            '</div>'.trim();
    };

    templates.embedsToolbar = function (addons) {
        var buttons = '';

        for (var k in addons) {
            buttons = buttons +
                '<li>' +
                '<button class="medium-editor-action" data-action="' + k + '">' + addons[k].label + '</button>' +
                '</li>';
        }

        return '<div class="medium-insert-embeds-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active">' +
            '<ul class="medium-editor-toolbar-actions clearfix">' + buttons + '</ul>' +
            '</div>' +

            '<div class="medium-insert-embeds-toolbar2 medium-editor-toolbar medium-editor-toolbar-active">' +
            '<ul class="medium-editor-toolbar-actions clearfix">' +
            '</ul>' +
            '</div>'.trim();
    };

    templates.embeds = function (className, content) {
        return '<div class="' + className + '" contenteditable="false">' + content + '</div>';
    };

    templates.embedsWrapper = function (html) {
        return '<div class="medium-insert-embeds" contenteditable="false">' +
            '<figure>' +
            '<div class="medium-insert-embed">' + html + '<div class="medium-insert-embeds-overlay"></div></div>' +
            '</figure>' +
            '</div>';
    };

    templates.imagesToolbar = function (styles) {
        var buttons = '';

        for (var k in styles) {
            buttons = buttons + '<li>' +
                '<button class="medium-editor-action" data-action="' + k + '">' + styles[k].label + '</button>' +
                '</li>';
        }

        return '<div class="medium-insert-images-toolbar medium-editor-toolbar medium-toolbar-arrow-under medium-editor-toolbar-active">' +
            '<ul class="medium-editor-toolbar-actions clearfix">' + buttons + '</ul>' +
            '</div>'.trim();
    };


    window.templates = templates;

})(window, jQuery);
