"@mixin"["rfp.client"] = {
    '1. User click on "Start New RFP"': function () {
        act.click(":containsExcludeChildren(Start New RFP)");
    },

    '2. Type in input "clientName"': function () {
        act.type("[name='clientName']", this.clientName);
    },

    '3. Type in input "sicCode"': function () {
        act.type("[name='sicCode']", "239");
    },

    '4. Type in input "employeesTotal"': function () {
        act.type("[name='employeeCount']", "12");
    },

    '5. Type in input "eligibleEmployees"': function () {
        act.type("[name='eligibleEmployees']", "12");
    },

    '6. Type in input "participatingEmploy..."': function () {
        act.type("[name='participatingEmployees']", "10");
    },

    '7. Type in input "membersCount"': function () {
        act.type("[name='membersCount']", "11");
    },

    '8. Type in input "retireesCount"': function () {
        act.type("[name='retireesCount']", "12");
    },

    '9. Type in input "cobraCount"': function () {
        act.type("[name='cobraCount']", "12");
    },

    '10. Type in input "clientsHeadquarters"': function () {

        act.type("[name='address']", "Demo address 1 street 1");
    },

    '11. Type in input "city"': function () {

        act.type("[name='city']", "San Diego");
    },

    '12. Type in input "-search"': function () {

        act.type("[name='state'] input", "California");
    },

    '13. Type in input "zipCode"': function () {

        act.type("[name='zip']", "11111");
    },

    '14. Type in input "minimumHours"': function () {
        act.type("[name='minimumHours']", "12");
    },

    '15. Click input "effectiveDate"': function () {
        act.type("[name='effectiveDate'].datepicker", "01/01/1981");
    },

    '16. Click input "dueDate"': function () {
        act.type("[name='dueDate'].datepicker", "02/01/1981");
    },

    "17. Click <domestic Partner>": function () {

        act.type("[name='domesticPartner'] input", "Broad");
    },

    "18. Type in text out To Bid Reason": function () {
        act.type("[name='outToBidReason']", "Test reason");
    },

    '19. Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    },

    '20. Click submit button "Save & Continue"': function () {
        act.click(":containsExcludeChildren(Save Continue)");
    }
};


