"@mixin"["presentation.enrollment"] = {
    "3.Click link": function () {
        var actionTarget = function () {
            return $(".ui.stackable.menu").find(" > a:nth(2)");
        };
        act.click(actionTarget);
    },
    '4.Click submit button "EDIT"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(EDIT)").eq(0);
        };
        act.click(actionTarget);
    },
    '5.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(2);
        };
        act.click(actionTarget);
    },
    "6.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '7.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(2);
        };
        act.type(actionTarget, "2");
    },
    '8.Click input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(2);
        };
        act.click(actionTarget);
    },
    "9.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '10.Type in input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(2);
        };
        act.type(actionTarget, "5");
    },
    '11.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.click(actionTarget);
    },
    "12.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '13.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.type(actionTarget, "2");
    },
    '14.Click input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(3);
        };
        act.click(actionTarget);
    },
    "15.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '16.Type in input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(3);
        };
        act.type(actionTarget, "6");
    },
    '17.Click submit button "SAVE CHANGES"': function () {
        act.click(":containsExcludeChildren(SAVE CHANGES)");
    },
    '18.Click submit button "EDIT"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(EDIT)").eq(1);
        };
        act.click(actionTarget);
    },
    '19.Click input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(3);
        };
        act.click(actionTarget);
    },
    "20.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '21.Type in input "value-1"': function () {
        var actionTarget = function () {
            return $("[name='value-1']").eq(3);
        };
        act.type(actionTarget, "5");
    },
    '22.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.click(actionTarget);
    },
    "23.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '24.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.type(actionTarget, "2");
    },
    '25.Click submit button "SAVE CHANGES"': function () {
        act.click(":containsExcludeChildren(SAVE CHANGES)");
    },
    '26.Click submit button "EDIT"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(EDIT)").eq(2);
        };
        act.click(actionTarget);
    },
    '27.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(1);
        };
        act.click(actionTarget);
    },
    "28.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '29.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(1);
        };
        act.type(actionTarget, "5");
    },
    '30.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.click(actionTarget);
    },
    "31.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '32.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(3);
        };
        act.type(actionTarget, "2");
    },
    '33.Click input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(2);
        };
        act.click(actionTarget);
    },
    "34.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    '35.Type in input "value-0"': function () {
        var actionTarget = function () {
            return $("[name='value-0']").eq(2);
        };
        act.type(actionTarget, "2");
    },
    '36.Click submit button "SAVE CHANGES"': function () {
        act.click(":containsExcludeChildren(SAVE CHANGES)");
    }
};

