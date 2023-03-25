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
            return $(".main-carrier.carrier-content-item").find(" > img:nth(0)")
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
        var actionTarget = function() {
            return $(":containsExcludeChildren(Select Plan)").eq(0);
        };
        act.click(actionTarget);
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
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(1);
        };
        act.click(actionTarget, {
            caretPos: 0
        });
    },
    "59.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "60.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(1);
        };
        act.type(actionTarget, "5");
    },
    "61.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(3);
        };
        act.click(actionTarget);
    },
    "62.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "63.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(3);
        };
        act.type(actionTarget, "2");
    },
    "64.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(5);
        };
        act.click(actionTarget);
    },
    "65.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "66.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(5);
        };
        act.type(actionTarget, "7");
    },
    "67.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(7);
        };
        act.click(actionTarget);
    },
    "68.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "69.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(7);
        };
        act.type(actionTarget, "2");
    },
    "70.Click input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(11);
        };
        act.click(actionTarget);
    },
    "71.Press key BACKSPACE": function() {
        act.press("backspace");
    },
    "72.Type in input": function() {
        var actionTarget = function() {
            return $(".ui.fluid.input").find(" > input:nth(0)").eq(11);
        };
        act.type(actionTarget, "8");
    },
    '73.Click submit button "Rider/Disclosures"': function() {
        act.click(":containsExcludeChildren(RiderDisclosures)");
    },
    '74.Click submit button "Plans"': function() {
        act.click(":containsExcludeChildren(Plans)");
    },
    '75.Click submit button "Back to Options"': function() {
        act.click(":containsExcludeChildren(Back to Options)");
    },
    '76.Click span "Add Option to Cart"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Add Option to Cart)").eq(3);
        };
        act.click(actionTarget);
    }
};

