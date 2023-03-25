;(function (window, $) {
    "use strict";

    // Overriding original behavior
    $.extend(MaterialLayout.prototype, {
        toggleDrawer: function () {
            var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);

            if (this.drawer_.className.match("--locked") !== null) {
                return false;
            }

            this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
            this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);

            // Set accessibility properties.
            if (this.drawer_.classList.contains(this.CssClasses_.IS_DRAWER_OPEN)) {
                this.drawer_.setAttribute('aria-hidden', 'false');
                drawerButton.setAttribute('aria-expanded', 'true');
            } else {
                this.drawer_.setAttribute('aria-hidden', 'true');
                drawerButton.setAttribute('aria-expanded', 'false');
            }

        }
    });

})(window, jQuery);
