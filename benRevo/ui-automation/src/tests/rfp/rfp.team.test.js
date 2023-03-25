"@mixin"["rfp.team"] = {
    '278.Click label "BenRevo Automation"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(BenRevo Automation)").eq(1);
        };
        act.click(actionTarget);
    },
    '279.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
};

