;(function () {
    "use strict";

    var PasteHandler = MediumEditor.extensions.paste.extend({
        createPasteBin: function (editable) {
        }
    });

    MediumEditor.extensions.paste = PasteHandler;

})();