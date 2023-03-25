"@mixin"["admin.client.vision"] = {
    "114.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    "115.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "116.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "117.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(2);
        };
        act.click(actionTarget);
    },
    "118.Type in input": function () {
        var actionTarget = function () {
            return $(".ui.input.planFormInput").find(" > input:nth(0)").eq(0);
        };
        act.type(actionTarget, "Test VPPO");
    },
    '119.Type in input "EXAMS_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EXAMS_FREQUENCY']");
        };
        act.type(actionTarget, "11");
    },
    '120.Type in input "LENSES_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='LENSES_FREQUENCY']");
        };
        act.type(actionTarget, "12");
    },
    '121.Type in input "FRAMES_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='FRAMES_FREQUENCY']");
        };
        act.type(actionTarget, "13");
    },
    '122.Type in input "CONTACTS_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CONTACTS_FREQUENCY']");
        };
        act.type(actionTarget, "11");
    },
    '123.Type in input "EXAM_COPAY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EXAM_COPAY']");
        };
        act.type(actionTarget, "12");
    },
    '124.Type in input "MATERIALS_COPAY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MATERIALS_COPAY']");
        };
        act.type(actionTarget, "11");
    },
    '125.Type in input "CONTACTS_ALLOWANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CONTACTS_ALLOWANCE']");
        };
        act.type(actionTarget, "11");
    },
    '126.Type in input "FRAME_ALLOWANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='FRAME_ALLOWANCE']");
        };
        act.type(actionTarget, "11");
    },
    '127.Click submit button "Save and Continue"': function () {
        act.click(":containsExcludeChildren(Save and Continue)");
    },
};

