"@mixin"["admin.client.select"] = {
    "3.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    '4.Type in input "-search"': function () {
        var actionTarget = function () {
            return $(".ui.form").find("[name='-search']").eq(1);
        };
        act.type(actionTarget, "au");
    },
    '5.Click span "BenRevo Automation"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(BenRevo Automation)").eq(2);
        };
        act.click(actionTarget);
    },
    '6.Click submit button "Get Client"': function () {
        act.click(":containsExcludeChildren(Get Client)");
    },
    '7.Click link "BenRevo Automation..."': function () {
        console.log(this.clientName);
        act.click(":containsExcludeChildren(BenRevo Automation " + this.clientName.replace(/[-#]+/g, "") + ")");
    },
};

