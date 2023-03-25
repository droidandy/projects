"@mixin"["rfp.enrollment"] = {
    "1.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "1");
    },
    "2.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "1");
    },
    "3.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    "4.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '5.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    "6.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "1");
    },
    "7.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "1");
    },
    "8.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-3").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "1");
    },
    "9.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    "10.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    "11.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-3").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '12.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    "13.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)");
        };
        act.type(actionTarget, "1");
    },
    "14.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)");
        };
        act.type(actionTarget, "1");
    },
    '15.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    }
};

