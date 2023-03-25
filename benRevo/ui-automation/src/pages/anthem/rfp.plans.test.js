"@mixin"["rfp.plans"] = {
    "1.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "2.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "3.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "4.Click div": function () {
        var actionTarget = function () {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "5.Type in input": function () {
        var actionTarget = function () {
            return $("#planName").find("[name='planName']")
        };
        act.type(actionTarget, "Test HMO");
    },
    '6.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE']");
        };
        act.type(actionTarget, "Test 1");
    },
    '7.Type in input "INDIVIDUAL_OOP_LIMIT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT']");
        };
        act.type(actionTarget, "1");
    },
    '8.Type in input "PCP"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP']");
        };
        act.type(actionTarget, "2");
    },
    '9.Type in input "SPECIALIST"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST']");
        };
        act.type(actionTarget, "3");
    },
    '10.Type in input "INPATIENT_HOSPITAL"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL']");
        };
        act.type(actionTarget, "4");
    },
    '11.Type in input "IP_COPAY_MAX"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_COPAY_MAX']");
        };
        act.type(actionTarget, "5");
    },
    '12.Type in input "IP_COPAY_TYPE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_COPAY_TYPE']");
        };
        act.type(actionTarget, "1");
    },
    '13.Type in input "OUTPATIENT_SURGERY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY']");
        };
        act.type(actionTarget, "2");
    },
    '14.Type in input "EMERGENCY_ROOM"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM']");
        };
        act.type(actionTarget, "1");
    },
    '15.Type in input "URGENT_CARE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='URGENT_CARE']");
        };
        act.type(actionTarget, "2");
    },
    '16.Type in input "DEDUCTIBLE_TYPE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE']");
        };
        act.type(actionTarget, "3");
    },
    '17.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '18.Type in input "RX_INDIVIDUAL_DEDUC..."': function () {
        var actionTarget = function () {
            return $("#RX_INDIVIDUAL_DEDUCTIBLE").find("[name='RX_INDIVIDUAL_DEDUCTIBLE']");
        };
        act.type(actionTarget, "1");
    },
    '19.Type in input "RX_FAMILY_DEDUCTIBLE"': function () {
        var actionTarget = function () {
            return $("#RX_FAMILY_DEDUCTIBLE").find("[name='RX_FAMILY_DEDUCTIBLE']");
        };
        act.type(actionTarget, "2");
    },
    '20.Type in input "MEMBER_COPAY_TIER_1"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_1").find("[name='MEMBER_COPAY_TIER_1']");
        };
        act.type(actionTarget, "3");
    },
    '21.Type in input "MEMBER_COPAY_TIER_2"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_2").find("[name='MEMBER_COPAY_TIER_2']");
        };
        act.type(actionTarget, "4");
    },
    '22.Type in input "MEMBER_COPAY_TIER_3"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_3").find("[name='MEMBER_COPAY_TIER_3']");
        };
        act.type(actionTarget, "1");
    },
    '23.Type in input "MEMBER_COPAY_TIER_4"': function () {
        var actionTarget = function () {
            return $("#MEMBER_COPAY_TIER_4").find("[name='MEMBER_COPAY_TIER_4']");
        };
        act.type(actionTarget, "1");
    },
    '24.Type in input "MAIL_ORDER"': function () {
        var actionTarget = function () {
            return $("#MAIL_ORDER").find("[name='MAIL_ORDER']");
        };
        act.type(actionTarget, "1");
    },
    "25.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    "26.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(3);
        };
        act.click(actionTarget);
    },
    "27.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(4);
        };
        act.click(actionTarget);
    },
    '28.Click span "OAMC – Open..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(OAMC Open Access Managed Choice)").eq(2);
        };
        act.click(actionTarget);
    },
    "30.Type in input": function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='planName']").eq(1)
        };
        act.type(actionTarget, "Test PPO");
    },
    '31.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '32.Type in input "INDIVIDUAL_DEDUCTIB..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '33.Type in input "CO_INSURANCE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CO_INSURANCE_IN']");
        };
        act.type(actionTarget, "3");
    },
    '34.Type in input "CO_INSURANCE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CO_INSURANCE_OUT']");
        };
        act.type(actionTarget, "4");
    },
    '35.Type in input "INDIVIDUAL_OOP_LIMI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT_IN']");
        };
        act.type(actionTarget, "1");
    },
    '36.Type in input "INDIVIDUAL_OOP_LIMI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INDIVIDUAL_OOP_LIMIT_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '37.Type in input "PCP_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP_IN']");
        };
        act.type(actionTarget, "1");
    },
    '38.Type in input "PCP_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PCP_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '39.Type in input "SPECIALIST_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST_IN']");
        };
        act.type(actionTarget, "1");
    },
    '40.Type in input "SPECIALIST_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SPECIALIST_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '41.Type in input "INPATIENT_HOSPITAL_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL_IN']");
        };
        act.type(actionTarget, "1");
    },
    '42.Type in input "INPATIENT_HOSPITAL_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='INPATIENT_HOSPITAL_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '43.Type in input "IP_PER_OCCURENCE_DE..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_PER_OCCURENCE_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '44.Type in input "IP_PER_OCCURENCE_DE..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IP_PER_OCCURENCE_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '45.Type in input "OUTPATIENT_SURGERY_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY_IN']");
        };
        act.type(actionTarget, "1");
    },
    '46.Type in input "OUTPATIENT_SURGERY_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='OUTPATIENT_SURGERY_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '47.Type in input "EMERGENCY_ROOM_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM_IN']");
        };
        act.type(actionTarget, "1");
    },
    '48.Type in input "EMERGENCY_ROOM_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EMERGENCY_ROOM_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '49.Type in input "DEDUCTIBLE_TYPE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '50.Type in input "DEDUCTIBLE_TYPE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DEDUCTIBLE_TYPE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '51.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '52.Type in input "COMBINE_MED_RX_DEDU..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='COMBINE_MED_RX_DEDUCTIBLE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '53.Type in input "RX_INDIVIDUAL_DEDUC..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='RX_INDIVIDUAL_DEDUCTIBLE']").eq(1);
        };
        act.type(actionTarget, "3");
    },
    '54.Type in input "RX_FAMILY_DEDUCTIBLE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='RX_FAMILY_DEDUCTIBLE']").eq(1);
        };
        act.type(actionTarget, "4");
    },
    '55.Type in input "MEMBER_COPAY_TIER_1"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_1']").eq(1);
        };
        act.type(actionTarget, "5");
    },
    '56.Type in input "MEMBER_COPAY_TIER_2"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_2']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '57.Type in input "MEMBER_COPAY_TIER_3"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_3']").eq(1);
        };
        act.type(actionTarget, "2");
    },
    '58.Type in input "MEMBER_COPAY_TIER_4"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MEMBER_COPAY_TIER_4']").eq(1);
        };
        act.type(actionTarget, "3");
    },
    '59.Type in input "MAIL_ORDER"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MAIL_ORDER']").eq(1);
        };
        act.type(actionTarget, "1");
    },
    '60.Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    "61.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "62.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "63.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "64.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(2);
        };
        act.click(actionTarget);
    },
    "65.Type in input": function () {
        var actionTarget = function () {
            return $("#planName").find("[name='planName']")
        };
        act.type(actionTarget, "Test DHMO");
    },
    '66.Type in input "ORAL_EXAMINATION"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORAL_EXAMINATION']");
        };
        act.type(actionTarget, "1");
    },
    '67.Type in input "ADULT_PROPHY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ADULT_PROPHY']");
        };
        act.type(actionTarget, "2");
    },
    '68.Type in input "CHILD_PROPHY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CHILD_PROPHY']");
        };
        act.type(actionTarget, "3");
    },
    '69.Type in input "SILVER_FILL_1_SURFA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SILVER_FILL_1_SURFACE']");
        };
        act.type(actionTarget, "4");
    },
    '70.Type in input "WHITE_FILL_1_SURFAC..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WHITE_FILL_1_SURFACE_ANTERIOR']");
        };
        act.type(actionTarget, "5");
    },
    '71.Type in input "MOLAR_ROOT_CANAL"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MOLAR_ROOT_CANAL']");
        };
        act.type(actionTarget, "1");
    },
    '72.Type in input "PERIO_MAINTAINANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='PERIO_MAINTAINANCE']");
        };
        act.type(actionTarget, "2");
    },
    '73.Type in input "SIMPLE_EXTRACTION_E..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='SIMPLE_EXTRACTION_ERUPTED_TOOTH']");
        };
        act.type(actionTarget, "3");
    },
    '74.Type in input "ORTHO_SERVICES_ADUL..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_SERVICES_ADULTS']");
        };
        act.type(actionTarget, "1");
    },
    '75.Type in input "ORTHO_SERVICES_CHIL..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_SERVICES_CHILDREN']");
        };
        act.type(actionTarget, "2");
    },
    "76.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    "77.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(3);
        };
        act.click(actionTarget);
    },
    "78.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(4);
        };
        act.click(actionTarget);
    },
    "79.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(4);
        };
        act.click(actionTarget);
    },
    "80.Type in input": function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='planName']").eq(1)
        };
        act.type(actionTarget, "Test DPPO");
    },
    '81.Type in input "CALENDAR_YEAR_MAXIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CALENDAR_YEAR_MAXIMUM_IN']");
        };
        act.type(actionTarget, "1");
    },
    '82.Type in input "CALENDAR_YEAR_MAXIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CALENDAR_YEAR_MAXIMUM_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '83.Type in input "DENTAL_INDIVIDUAL_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_INDIVIDUAL_IN']");
        };
        act.type(actionTarget, "1");
    },
    '84.Type in input "DENTAL_INDIVIDUAL_O..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_INDIVIDUAL_OUT']");
        };
        act.type(actionTarget, "3");
    },
    '85.Type in input "DENTAL_FAMILY_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_FAMILY_IN']");
        };
        act.type(actionTarget, "1");
    },
    '86.Type in input "DENTAL_FAMILY_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='DENTAL_FAMILY_OUT']");
        };
        act.type(actionTarget, "3");
    },
    '87.Type in input "WAIVED_FOR_PREVENTI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WAIVED_FOR_PREVENTIVE_IN']");
        };
        act.type(actionTarget, "2");
    },
    '88.Type in input "WAIVED_FOR_PREVENTI..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='WAIVED_FOR_PREVENTIVE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '89.Type in input "CLASS_1_PREVENTIVE_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_1_PREVENTIVE_IN']");
        };
        act.type(actionTarget, "2");
    },
    '90.Type in input "CLASS_1_PREVENTIVE_..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_1_PREVENTIVE_OUT']");
        };
        act.type(actionTarget, "1");
    },
    '91.Type in input "CLASS_2_BASIC_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_2_BASIC_IN']");
        };
        act.type(actionTarget, "1");
    },
    '92.Type in input "CLASS_2_BASIC_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_2_BASIC_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '93.Type in input "CLASS_3_MAJOR_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_3_MAJOR_IN']");
        };
        act.type(actionTarget, "1");
    },
    '94.Type in input "CLASS_3_MAJOR_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_3_MAJOR_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '95.Type in input "CLASS_4_ORTHODONTIA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_4_ORTHODONTIA_IN']");
        };
        act.type(actionTarget, "1");
    },
    '96.Type in input "CLASS_4_ORTHODONTIA..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CLASS_4_ORTHODONTIA_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '97.Type in input "ORTHODONTIA_LIFETIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHODONTIA_LIFETIME_MAX_IN']");
        };
        act.type(actionTarget, "1");
    },
    '98.Type in input "ORTHODONTIA_LIFETIM..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHODONTIA_LIFETIME_MAX_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '99.Type in input "ORTHO_ELIGIBILITY_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_ELIGIBILITY_IN']");
        };
        act.type(actionTarget, "1");
    },
    '100.Type in input "ORTHO_ELIGIBILITY_O..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='ORTHO_ELIGIBILITY_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '101.Type in input "REIMBURSEMENT_SCHED..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='REIMBURSEMENT_SCHEDULE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '102.Type in input "REIMBURSEMENT_SCHED..."': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='REIMBURSEMENT_SCHEDULE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '103.Type in input "IMPLANT_COVERAGE_IN"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IMPLANT_COVERAGE_IN']");
        };
        act.type(actionTarget, "1");
    },
    '104.Type in input "IMPLANT_COVERAGE_OUT"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='IMPLANT_COVERAGE_OUT']");
        };
        act.type(actionTarget, "2");
    },
    '105.Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    "106.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "107.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(1);
        };
        act.click(actionTarget);
    },
    "108.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "109.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(2);
        };
        act.click(actionTarget);
    },
    "110.Type in input": function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='planName']")
        };
        act.type(actionTarget, "Test VPPO");
    },
    '111.Type in input "EXAMS_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EXAMS_FREQUENCY']");
        };
        act.type(actionTarget, "1");
    },
    '112.Type in input "LENSES_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='LENSES_FREQUENCY']");
        };
        act.type(actionTarget, "2");
    },
    '113.Type in input "FRAMES_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='FRAMES_FREQUENCY']");
        };
        act.type(actionTarget, "3");
    },
    '114.Type in input "CONTACTS_FREQUENCY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CONTACTS_FREQUENCY']");
        };
        act.type(actionTarget, "1");
    },
    '115.Type in input "EXAM_COPAY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='EXAM_COPAY']");
        };
        act.type(actionTarget, "2");
    },
    '116.Type in input "MATERIALS_COPAY"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='MATERIALS_COPAY']");
        };
        act.type(actionTarget, "3");
    },
    '117.Type in input "CONTACTS_ALLOWANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='CONTACTS_ALLOWANCE']");
        };
        act.type(actionTarget, "4");
    },
    '118.Type in input "FRAME_ALLOWANCE"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='FRAME_ALLOWANCE']");
        };
        act.type(actionTarget, "5");
    },
    '119.Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    }
};

