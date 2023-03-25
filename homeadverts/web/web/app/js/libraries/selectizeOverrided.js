;(function (window, $) {
    "use strict";

    // Overriding original behavior
    $.extend(Selectize.prototype, {
        updatePlaceholder: function() {
            if (!this.settings.placeholder) return;
            var $input = this.$control_input;

            $input.attr('placeholder', this.settings.placeholder);
            $input.triggerHandler('update', {force: true});
        },
        onItemSelect: function(e) {
            var id = $(e.target).attr('data-value');
            this.removeItem(id, true);
        }
    });

})(window, jQuery);