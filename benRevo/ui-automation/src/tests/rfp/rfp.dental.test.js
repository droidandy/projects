"@mixin"["rfp.dental"] = {
    '140.Click submit button "PEPM"': function() {
        act.click(":containsExcludeChildren(PEPM)");
    },
    '141.Click input "commissionAmount"': function() {
        act.click("[name='commission']");
    },
    '142.Type in input "commissionAmount"': function() {
        act.type("[name='commission']", "123");
    },
    "143.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "144.Click div": function() {
        var actionTarget = function() {
            return $("[name='AMERITAS'].item")
        };
        act.click(actionTarget);
    },
    "145.Click input": function() {
        var actionTarget = function() {
            return $(".ui.input").find(" > input:nth(0)").eq(1);
        };
        act.click(actionTarget);
    },
    "146.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.input").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '147.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '148.Click submit button "3"': function() {
        act.click(":containsExcludeChildren(3)");
    },
    "149.Click <i>": function() {
        act.click(".plus.icon");
    },
    "150.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "151.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "152.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(0);
        };
        act.click(actionTarget);
    },
    "153.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "TESTP");
    },
    "154.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(1);
        };
        act.click(actionTarget);
    },
    "155.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "TESTDPPO");
    },
    '156.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '157.Click submit button "VOLUNTARY"': function() {
        act.click(":containsExcludeChildren(VOLUNTARY)");
    },
    "158.Check Dental Contribution Page": function() {
        ok($(".ui.segment.ui.stackable.two.column.grid.gridSegment").length > 0, "Has Voluntary");
    },
    '159.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '160.Click label "No"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(No)").eq(0);
        };
        act.click(actionTarget);
    },
    '161.Click submit button "Upload summary"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload summary)").eq(0);
        };
        act.click(actionTarget);
    },
    '162.Upload "benrevo-test.docx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone-inner").find(" > input:nth(0)").eq(0);
        };
        act.upload(actionTarget, "./uploads/benrevo-test.docx");
    },
    '163.Click label "Yes"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Yes)").eq(1);
        };
        act.click(actionTarget);
    },
    "164.Click text area": function() {
        act.click(".rfpQuoteTextarea1");
    },
    "165.Type in text area": function() {
        act.type(".rfpQuoteTextarea1", "New Test");
    },
    '166.Click submit button "Upload summary"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload summary)").eq(1);
        };
        act.click(actionTarget);
    },
    '167.Upload "benrevo-test-2.docx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone-inner").find(" > input:nth(0)").eq(1);
        };
        act.upload(actionTarget, "./uploads/benrevo-test-2.docx");
    },
    '168.Click submit button "Save & Continue"': function() {
        act.click(":containsExcludeChildren(Save Continue)");
    },
};

