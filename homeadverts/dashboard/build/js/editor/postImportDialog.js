;(function (window, $) {
    "use strict";

    function EditorPostImportDialog(className) {
        this.className = className;
        this.window = $(this.className);

        if (!this.window.length) {
            return;
        }

        this.closeButtonTop = this.window.find('.close');
        this.closeButtonBottom = this.window.find('.actions button');

        this.initActions();
    }

    EditorPostImportDialog.prototype.initActions = function () {
        var _this = this;

        this.window.on('click', function () {
            _this.window.remove();
        });
        this.closeButtonTop.on('click', function () {
            _this.window.remove();
        });
        this.closeButtonBottom.on('click', function () {
            _this.window.remove();
        });
    };


    $(document).ready(function () {
        new EditorPostImportDialog('.post-import-dialog');
    });

})(window, jQuery);
