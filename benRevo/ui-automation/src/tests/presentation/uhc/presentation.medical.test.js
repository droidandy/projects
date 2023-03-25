"@mixin"["presentation.medical"] = {
    '36.Click span "Medical"': function() {
        act.click(":containsExcludeChildren(Medical)");
    },
    "37.Wait 10000 milliseconds": function() {
        act.wait(1e4);
    },
    "38.Click div": function() {
        act.click(".card-add-inner");
    },
    "39.Click image": function() {
        var actionTarget = function() {
            return $(".ui.image").eq(7);
        };
        act.click(actionTarget);
    },
    '40.Click submit button "No"': function() {
        act.click(":containsExcludeChildren(No)");
    },
    "41.Wait 10000 milliseconds": function() {
        act.wait(1e4);
    },
    '41.Click link "Change network"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Change network)").eq(0);
        };
        act.click(actionTarget);
    },
    "42.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "43.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    '44.Click submit button "Save"': function() {
        act.click(":containsExcludeChildren(Save)");
    },
    "45.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "46.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    '47.Click submit button "Add Plan Option"': function() {
        act.click(":containsExcludeChildren(Add Plan Option)");
    },
    '48.Click span "Select Plan"': function() {
        act.click(":containsExcludeChildren(Select Plan)");
    },
    "49.Click <i>": function() {
        var actionTarget = function() {
            return $("#primary").find(".chevron.right.icon");
        };
        act.click(actionTarget);
    },
    "50.Click <i>": function() {
        var actionTarget = function() {
            return $("#primary").find(".chevron.right.icon");
        };
        act.click(actionTarget);
    },
    '51.Click span "SELECTED"': function() {
        act.click(":containsExcludeChildren(SELECT)");
    },
    '52.Click link "Option 2"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Option 2)").eq(0);
        };
        act.click(actionTarget);
    },
    '53.Click link "Change network"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Change network)").eq(2);
        };
        act.click(actionTarget);
    },
    "54.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "55.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    '56.Click submit button "Save"': function() {
        act.click(":containsExcludeChildren(Save)");
    },
    '57.Click submit button "Contribution"': function() {
        act.click(":containsExcludeChildren(Contribution)");
    },
    "58.Click input": function() {
        act.click("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(3) > div:nth(6) > div:nth(0) > input:nth(0)");
    },
    "59.Click input": function() {
        act.click("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(6) > div:nth(0) > input:nth(0)");
    },
    "60.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "61.Type in input": function() {
        act.type("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(6) > div:nth(0) > input:nth(0)", "5");
    },
    "62.Click input": function() {
        act.click("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(6) > div:nth(0) > input:nth(0)");
    },
    "63.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "64.Type in input": function() {
        act.type("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(6) > div:nth(0) > input:nth(0)", "5");
    },
    "65.Click input": function() {
        act.click("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(2) > div:nth(6) > div:nth(0) > input:nth(0)");
    },
    "66.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "67.Type in input": function() {
        act.type("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(2) > div:nth(6) > div:nth(0) > input:nth(0)", "5");
    },
    "68.Click input": function() {
        act.click("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(3) > div:nth(6) > div:nth(0) > input:nth(0)");
    },
    "69.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "70.Type in input": function() {
        act.type("body > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(4) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(3) > div:nth(6) > div:nth(0) > input:nth(0)", "5");
    },
    "71.Click div": function() {
        var actionTarget = function() {
            return $(".ui.left.aligned.equal.width.grid").find(" > div:nth(3)").eq(2);
        };
        act.click(actionTarget);
    },
    '72.Click submit button "Rider/Disclosures"': function() {
        act.click(":containsExcludeChildren(RiderDisclosures)");
    },
    '73.Click submit button "Plans"': function() {
        act.click(":containsExcludeChildren(Plans)");
    },
    '74.Click submit button "Back to Options"': function() {
        act.click(":containsExcludeChildren(Back to Options)");
    },
    '75.Click span "Add Option to Cart"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Add Option to Cart)").eq(2);
        };
        act.click(actionTarget);
    }
};

