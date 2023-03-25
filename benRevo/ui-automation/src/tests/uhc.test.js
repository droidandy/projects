"@fixture uhc";
"@page ./uhc/";
"@require ./mixin.js";
"@require ./rfp/uhc/rfp.client.test.js";
"@require ./rfp/rfp.medical.test.js";
"@require ./rfp/rfp.dental.test.js";
"@require ./rfp/rfp.vision.test.js";
"@require ./rfp/rfp.rates.test.js";
"@require ./rfp/rfp.enrollment.test.js";
"@require ./rfp/rfp.team.test.js";
"@require ./presentation/presentation.enrollment.test.js";
"@require ./presentation/uhc/presentation.medical.test.js";
"@require ./presentation/presentation.dental.test.js";
"@require ./presentation/presentation.vision.test.js";
"@require ./presentation/presentation.final.test.js";
"@require ./admin/client/admin.client.select.test.js";
"@require ./admin/client/admin.client.medical.test.js";
"@require ./admin/client/admin.client.dental.test.js";
"@require ./admin/client/admin.client.vision.test.js";
"@require ./admin/client/uhc/admin.client.notes.test.js";

var clientName = "Benrevo-UI-Automation-#" + new Date().getTime();

"@test"["full"] = {
    'Start': '@mixin start.main',
    'Log In': '@mixin authentication',
    'Run RFP Client': '@mixin rfp.client',
    'Run RFP Medical': '@mixin rfp.medical',
    'Run RFP Dental': '@mixin rfp.dental',
    'Run RFP Vision': '@mixin rfp.vision',
    'Run RFP Rates': '@mixin rfp.rates',
    'Run RFP Enrollment': '@mixin rfp.enrollment',
    'Run RFP Team': '@mixin rfp.team',

    "280.Check Send to Carrier page": function () {
        eq($(".client-complete").text(), "Complete");
        eq($(".medical-complete").text(), "Complete");
        eq($(".dental-complete").text(), "Complete");
        eq($(".vision-complete").text(), "Complete");
        eq($(".enrollment-complete").text(), "Complete");
        eq($(".rates-complete").text(), "Complete");
    },
    "281.Wait 10000 milliseconds": function () {
        act.wait(1e4);
    },
    '282.Click submit button "Submit To Carrier"': function () {
        act.click(":containsExcludeChildren(Submit To Carrier)");
    },
    "283.Wait 10000 milliseconds": function () {
        act.wait(1e4);
    },
    "284.Check RFP submitted": function () {
        //act.wait(5e3);
        setTimeout(function () {
            eq($(".census-one-more-step").text(), "One more step");
            ok($("[alt='success']").length > 0, "Has finish icon");
        }, 10000);
    },
    'Open Admin': function () {
        act.navigateTo("https://dev.superadmin.ops.benrevo.com/");
    },
    'Log In Admin': function () {
        var actionTarget = function () {
            return $("#lock-container").find(":containsExcludeChildren(automationbenrevocom)");
        };
        act.click(actionTarget);
    },
    "1.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    '2.Click span "UnitedHealthcare"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(UnitedHealthcare)").eq(2);
        };
        act.click(actionTarget);
    },
    'Select Client': '@mixin admin.client.select',
    'Run Admin Medical': '@mixin admin.client.medical',
    'Run Admin Dental': '@mixin admin.client.dental',
    'Run Admin Vision': '@mixin admin.client.vision',
    'Run Admin Notes': '@mixin admin.client.notes',
    'Open Main': function () {
        act.navigateTo("http://dev.benrevo.com/uhc/clients");
    },
    'Start Presentation': '@mixin start.presentation',
    'Run Presentation Enrollment': '@mixin presentation.enrollment',
    'Run Presentation Medical': '@mixin presentation.medical',
    'Run Presentation Dental': '@mixin presentation.dental',
    'Run Presentation Vision': '@mixin presentation.vision',
    'Run Presentation Final': '@mixin presentation.final'
};