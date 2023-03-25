"@mixin"["rfp.vision"] = {
    '169.Click submit button "Net Of Commissions"': function() {
        act.click(":containsExcludeChildren(Net Of Commissions)");
    },
    "170.Check Vision Inforamtion Page": function() {
        ok($(".row").eq(2).length > 0, "Has Net of Commissions");
    },
    "171.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "172.Click div": function() {
        var actionTarget = function() {
            return $("[name='EYEMED'].item")
        };
        act.click(actionTarget);
    },
    "173.Click input": function() {
        var actionTarget = function() {
            return $(".ui.input").find(" > input:nth(0)");
        };
        act.click(actionTarget);
    },
    "174.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.input").find(" > input:nth(0)");
        };
        act.type(actionTarget, "3");
    },
    '175.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '148.Click submit button "2"': function() {
        var actionTarget = function() {
            return $("[name='rfpButtonTier2'].ui.medium.toggle.button");
        };
        act.click(actionTarget);
    },
    "176.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)");
        };
        act.click(actionTarget);
    },
    "177.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)");
        };
        act.type(actionTarget, "Test3");
    },
    '178.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '179.Click submit button "$"': function() {
        var actionTarget = function() {
            return $("[name='contributionType'].ui.medium.toggle.button").eq(1);
        };
        act.click(actionTarget);
    },
    "180.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)");
        };
        act.click(actionTarget);
    },
    "181.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "182.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-1").find(" > input:nth(0)");
        };
        act.type(actionTarget, "1");
    },
    "183.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)");
        };
        act.click(actionTarget);
    },
    "184.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "185.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input.tier-item-2").find(" > input:nth(0)");
        };
        act.type(actionTarget, "2");
    },
    '186.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '187.Click submit button "Upload summary"': function() {
        act.click(":containsExcludeChildren(Upload summary)");
    },
    '188.Upload "benrevo-test.docx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone-inner").find(" > input:nth(0)");
        };
        act.upload(actionTarget, "./uploads/benrevo-test.docx");
    },
    '189.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    }
};

