"@mixin"["admin.client.dental"] = {
    "69.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    "70.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "71.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "72.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(2);
        };
        act.click(actionTarget);
    },
    "73.Type in input": function () {
        act.type("body > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(2) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > form:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(1) > div:nth(0) > input:nth(0)", "Test DHMO");
    },
    '74.Type in input "ORAL_EXAMINATION"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORAL_EXAMINATION']");
        };
        act.type(actionTarget, "1");
    },
    '75.Type in input "ADULT_PROPHY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ADULT_PROPHY']");
        };
        act.type(actionTarget, "2");
    },
    '76.Type in input "CHILD_PROPHY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CHILD_PROPHY']");
        };
        act.type(actionTarget, "11");
    },
    '77.Type in input "SILVER_FILL_1_SURFA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SILVER_FILL_1_SURFACE']");
        };
        act.type(actionTarget, "12");
    },
    '78.Type in input "WHITE_FILL_1_SURFAC..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WHITE_FILL_1_SURFACE_ANTERIOR']");
        };
        act.type(actionTarget, "13");
    },
    '79.Type in input "MOLAR_ROOT_CANAL"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MOLAR_ROOT_CANAL']");
        };
        act.type(actionTarget, "11");
    },
    '80.Type in input "PERIO_MAINTAINANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PERIO_MAINTAINANCE']");
        };
        act.type(actionTarget, "111");
    },
    '81.Type in input "SIMPLE_EXTRACTION_E..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SIMPLE_EXTRACTION_ERUPTED_TOOTH']");
        };
        act.type(actionTarget, "1");
    },
    '82.Type in input "ORTHO_SERVICES_ADUL..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_SERVICES_ADULTS']");
        };
        act.type(actionTarget, "2");
    },
    '83.Type in input "ORTHO_SERVICES_CHIL..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_SERVICES_CHILDREN']");
        };
        act.type(actionTarget, "3");
    },
    "84.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "85.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(3);
        };
        act.click(actionTarget);
    },
    "86.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    "87.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(4);
        };
        act.click(actionTarget);
    },
    "88.Type in input": function () {
        act.type("body > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(1) > form:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(1) > div:nth(0) > input:nth(0)", "Test DPPO");
    },
    '89.Type in input "CALENDAR_YEAR_MAXIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CALENDAR_YEAR_MAXIMUM_IN']");
        };
        act.type(actionTarget, "1");
    },
    '90.Type in input "CALENDAR_YEAR_MAXIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CALENDAR_YEAR_MAXIMUM_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '91.Type in input "DENTAL_INDIVIDUAL_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_INDIVIDUAL_IN']");
        };
        act.type(actionTarget, "1");
    },
    '92.Type in input "DENTAL_INDIVIDUAL_O..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_INDIVIDUAL_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '93.Type in input "DENTAL_FAMILY_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_FAMILY_IN']");
        };
        act.type(actionTarget, "1");
    },
    '94.Type in input "DENTAL_FAMILY_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_FAMILY_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '95.Type in input "WAIVED_FOR_PREVENTI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WAIVED_FOR_PREVENTIVE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '96.Type in input "WAIVED_FOR_PREVENTI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WAIVED_FOR_PREVENTIVE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '97.Type in input "CLASS_1_PREVENTIVE_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_1_PREVENTIVE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '98.Type in input "CLASS_1_PREVENTIVE_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_1_PREVENTIVE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '99.Type in input "CLASS_2_BASIC_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_2_BASIC_IN']");
        };
        act.type(actionTarget, "1");
    },
    '100.Type in input "CLASS_2_BASIC_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_2_BASIC_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '101.Type in input "CLASS_3_MAJOR_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_3_MAJOR_IN']");
        };
        act.type(actionTarget, "1");
    },
    '102.Type in input "CLASS_3_MAJOR_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_3_MAJOR_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '103.Type in input "CLASS_4_ORTHODONTIA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_4_ORTHODONTIA_IN']");
        };
        act.type(actionTarget, "1");
    },
    '104.Type in input "CLASS_4_ORTHODONTIA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_4_ORTHODONTIA_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '105.Type in input "ORTHODONTIA_LIFETIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHODONTIA_LIFETIME_MAX_IN']");
        };
        act.type(actionTarget, "1");
    },
    '106.Type in input "ORTHODONTIA_LIFETIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHODONTIA_LIFETIME_MAX_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '107.Type in input "ORTHO_ELIGIBILITY_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_ELIGIBILITY_IN']");
        };
        act.type(actionTarget, "1");
    },
    '108.Type in input "ORTHO_ELIGIBILITY_O..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_ELIGIBILITY_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '109.Type in input "REIMBURSEMENT_SCHED..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='REIMBURSEMENT_SCHEDULE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '110.Type in input "REIMBURSEMENT_SCHED..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='REIMBURSEMENT_SCHEDULE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '111.Type in input "IMPLANT_COVERAGE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IMPLANT_COVERAGE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '112.Type in input "IMPLANT_COVERAGE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IMPLANT_COVERAGE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '113.Click submit button "Save and Continue"': function () {
        act.click(":containsExcludeChildren(Save and Continue)");
    },
};

