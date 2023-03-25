"@mixin"["rfp.medical"] = {
    '1. [Information]. Click input "Waiting period"': function () {
        act.type("[name='daysAfterHire'] input", '1st of the month following date of hire');
    },
    '2. Click submit button "PEPM"': function () {
        act.click(":containsExcludeChildren(PEPM)");
    },
    '3. Type in input "commissionAmount"': function () {
        act.type("[name='commission']", "12");
    },
    '5. Click label "Yes"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Yes)").eq(0);
        };
        act.click(actionTarget);
    },
    "6. Select Which carrier are you currently with": function () {
        act.click("[name='carriers'] input");
    },

    "7. Select How many years have you been with them?": function () {
        var actionTarget = function () {
            return $("[name='carriers'] input").eq(1);
        };
        act.click(actionTarget);
    },

    '8. Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    },

    '9. [Current Options]. Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    },
    '10. [Dental]. Click submit button "Dental"': function () {
        act.click(":containsExcludeChildren(Dental)");
    },


};

