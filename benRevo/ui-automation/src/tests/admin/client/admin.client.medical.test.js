"@mixin"["admin.client.medical"] = {
    '8.Click span "Medical"': function () {
        act.click(":containsExcludeChildren(Medical)");
    },
    "9.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    "10.Click div": function () {
        var actionTarget = function () {
            return $("#container-pusher").find(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "11.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "12.Click div": function () {
        var actionTarget = function () {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "13.Type in input": function () {
        act.type("body > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(2) > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > form:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(1) > div:nth(0) > input:nth(0)", "Test HMO");
    },
    '14.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '15.Type in input "INDIVIDUAL_OOP_LIMIT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT']");
        };
        act.type(actionTarget, "2");
    },
    '16.Type in input "PCP"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP']");
        };
        act.type(actionTarget, "1");
    },
    '17.Type in input "SPECIALIST"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST']");
        };
        act.type(actionTarget, "1");
    },
    '18.Type in input "INPATIENT_HOSPITAL"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL']");
        };
        act.type(actionTarget, "1");
    },
    '19.Type in input "IP_COPAY_MAX"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_COPAY_MAX']");
        };
        act.type(actionTarget, "2");
    },
    '20.Type in input "IP_COPAY_TYPE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_COPAY_TYPE']");
        };
        act.type(actionTarget, "1");
    },
    '21.Type in input "OUTPATIENT_SURGERY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY']");
        };
        act.type(actionTarget, "1");
    },
    '22.Type in input "EMERGENCY_ROOM"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM']");
        };
        act.type(actionTarget, "2");
    },
    '23.Type in input "DEDUCTIBLE_TYPE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE']");
        };
        act.type(actionTarget, "1");
    },
    '24.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '25.Type in input "URGENT_CARE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='URGENT_CARE']");
        };
        act.type(actionTarget, "1");
    },
    '26.Type in input "RX_INDIVIDUAL_DEDUC..."': function () {
        var actionTarget = function () {
            return $("#RX_INDIVIDUAL_DEDUCTIBLE").find("[name='RX_INDIVIDUAL_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '27.Type in input "RX_FAMILY_DEDUCTIBLE"': function () {
        var actionTarget = function () {
            return $("#RX_FAMILY_DEDUCTIBLE").find("[name='RX_FAMILY_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '28.Type in input "MEMBER_COPAY_TIER_1"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_1").find("[name='MEMBER_COPAY_TIER_1']");
        };
        act.type(actionTarget, "1");
    },
    '29.Type in input "MEMBER_COPAY_TIER_2"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_2").find("[name='MEMBER_COPAY_TIER_2']");
        };
        act.type(actionTarget, "1");
    },
    '30.Type in input "MEMBER_COPAY_TIER_3"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_3").find("[name='MEMBER_COPAY_TIER_3']");
        };
        act.type(actionTarget, "1");
    },
    '31.Type in input "MEMBER_COPAY_TIER_4"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_4").find("[name='MEMBER_COPAY_TIER_4']");
        };
        act.type(actionTarget, "1");
    },
    '32.Type in input "MAIL_ORDER"': function () {
        var actionTarget = function () {
            return $("#MAIL_ORDER").find("[name='MAIL_ORDER']");
        };
        act.type(actionTarget, "1");
    },
    "33.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "34.Click div": function () {
        var actionTarget = function () {
            return $("#container-pusher").find(".selected.item").eq(3);
        };
        act.click(actionTarget);
    },
    "35.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    "36.Click div": function () {
        var actionTarget = function () {
            return $(".menu.transition.visible").find(" > div:nth(0)");
        };
        act.click(actionTarget);
    },
    "37.Type in input": function () {
        act.type("body > div:nth(0) > div:nth(0) > div:nth(0) > div:nth(1) > div:nth(1) > div:nth(1) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(0) > div:nth(2) > div:nth(0) > div:nth(1) > div:nth(0) > div:nth(1) > form:nth(0) > div:nth(0) > div:nth(0) > div:nth(3) > div:nth(1) > div:nth(0) > input:nth(0)", "Test PPO");
    },
    '38.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '39.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '40.Type in input "CO_INSURANCE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CO_INSURANCE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '41.Type in input "CO_INSURANCE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CO_INSURANCE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '42.Type in input "INDIVIDUAL_OOP_LIMI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '43.Type in input "INDIVIDUAL_OOP_LIMI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT_IN']");
        };
        act.type(actionTarget, "1");
    },
    '44.Type in input "PCP_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP_IN']");
        };
        act.type(actionTarget, "1");
    },
    '45.Type in input "PCP_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '46.Type in input "SPECIALIST_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST_IN']");
        };
        act.type(actionTarget, "1");
    },
    '47.Type in input "SPECIALIST_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '48.Click input "INPATIENT_HOSPITAL_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL_OUT']");
        };
        act.click(actionTarget);
    },
    '49.Type in input "INPATIENT_HOSPITAL_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL_IN']");
        };
        act.type(actionTarget, "1");
    },
    '50.Type in input "IP_PER_OCCURENCE_DE..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_PER_OCCURENCE_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "11");
    },
    '51.Type in input "IP_PER_OCCURENCE_DE..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_PER_OCCURENCE_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '52.Type in input "INPATIENT_HOSPITAL_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '53.Type in input "OUTPATIENT_SURGERY_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY_IN']");
        };
        act.type(actionTarget, "11");
    },
    '54.Type in input "OUTPATIENT_SURGERY_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '55.Type in input "EMERGENCY_ROOM_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '56.Type in input "EMERGENCY_ROOM_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM_IN']");
        };
        act.type(actionTarget, "11");
    },
    '57.Type in input "DEDUCTIBLE_TYPE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE_IN']");
        };
        act.type(actionTarget, "11");
    },
    '58.Type in input "DEDUCTIBLE_TYPE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '59.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "11");
    },
    '60.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "11");
    },
    '61.Type in input "RX_INDIVIDUAL_DEDUC..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='RX_INDIVIDUAL_DEDUCTIBLE']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '62.Type in input "RX_FAMILY_DEDUCTIBLE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='RX_FAMILY_DEDUCTIBLE']").eq(1);
        };
        act.type(actionTarget, "2");
    },
    '63.Type in input "MEMBER_COPAY_TIER_1"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_1']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '64.Type in input "MEMBER_COPAY_TIER_2"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_2']").eq(1);
        };
        act.type(actionTarget, "2");
    },
    '65.Type in input "MEMBER_COPAY_TIER_3"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_3']").eq(1);
        };
        act.type(actionTarget, "3");
    },
    '66.Type in input "MEMBER_COPAY_TIER_4"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_4']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '67.Type in input "MAIL_ORDER"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MAIL_ORDER']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '68.Click submit button "Save and Continue"': function () {
        act.click(":containsExcludeChildren(Save and Continue)");
    },
};

