"@mixin"["authentication"] = {
    "2.Click input": function () {
        var actionTarget = function () {
            return $(".auth0-lock-widget").find("[name='email']");
        };
        act.click(actionTarget);
    },
    "3.Press key combination CTRL+A": function () {
        act.press("ctrl+a");
    },
    "4.Press key BACKSPACE": function () {
        act.press("backspace");
    },
    "5.Type in input": function () {
        var actionTarget = function () {
            return $(".auth0-lock-widget").find("[name='email']");
        };
        act.type(actionTarget, "automation@benrevo.com");
    },
    '6.Click password input "password"': function () {
        var actionTarget = function () {
            return $(".auth0-lock-widget").find("[name='password']");
        };
        act.click(actionTarget);
    },
    '7.Type in password input "password"': function () {
        var actionTarget = function () {
            return $(".auth0-lock-widget").find("[name='password']");
        };
        act.type(actionTarget, "aut0mati0n!");
    },
    "8.Click span": function () {
        var actionTarget = function () {
            return $(".auth0-label-submit").find(" > span:nth(0)");
        };
        act.click(actionTarget);
    }
};

"@mixin"["start.main"] = {
    '0.Get Client Name': function () {
        this.clientName = clientName;
    },
    '1.Click span "Login"': function () {
        var actionTarget = function () {
            return $(".item.login-button").find(" > span:nth(0)");
        };
        act.click(actionTarget);
    }
};

"@mixin"["start.presentation"] = {
    "1.Click div": function () {
        var me = this;
        var actionTarget = function () {
            return $("[name='" + me.clientName + "']").find(" > td:nth(4) > div:nth(0)");
        };
        act.click(actionTarget);
    },
    '2.Click link "Presentation"': function () {
        var actionTarget = function () {
            return $(".menu.transition.visible").find(" > a:nth(1)");
        };
        act.click(actionTarget);
    }
};