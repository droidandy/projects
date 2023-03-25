"@mixin"["admin.client.notes"] = {
    '1.Click submit button "Add Notes"': function () {
        act.click("[name='kaiser-summary-add'].ui.medium.primary.button");
    },
    "2.Type in text area": function () {
        var actionTarget = function () {
            return $(".ui.small.modal.transition.visible.active.summary-modal").find(" > textarea:nth(0)");
        };
        act.type(actionTarget, "Test Kaiser");
    },
    '3.Click submit button "ADD NOTES"': function () {
        act.click(":containsExcludeChildren(ADD NOTES)");
    },
    '4.Click submit button "Upload"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Upload)").eq(2);
        };
        act.click(actionTarget);
    },
    '5.Upload "ant-medical-Best Best & Krieger (Los Angeles).xls" file': function () {
        var actionTarget = function () {
            return $(".drop-zone").find(" > input:nth(0)").eq(1);
        };
        act.upload(actionTarget, "./uploads/ant-medical-Best Best & Krieger (Los Angeles).xls");
    },
    '6.Click submit button "Upload"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Upload)").eq(3);
        };
        act.click(actionTarget);
    },
    '7.Upload "ant-kaiser-Lytton Rancheria (San Diego).xls" file': function () {
        var actionTarget = function () {
            return $(".drop-zone").find(" > input:nth(0)").eq(3);
        };
        act.upload(actionTarget, "./uploads/ant-kaiser-Lytton Rancheria (San Diego).xls");
    },
    "8.Wait 10000 milliseconds": function () {
        act.wait(1e4);
    },
    "8.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    '9.Click span "Single_Priority..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(SinglePriority Select Network)").eq(1);
        };
        act.click(actionTarget);
    },
    "10.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    '11.Click span "PS-Premier HMO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(PSPremier HMO 15100 RxEssential Formulary 515254530)").eq(1);
        };
        act.click(actionTarget);
    },
    "12.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "13.Click div": function () {
        var actionTarget = function () {
            return $(".selected.item").eq(3);
        };
        act.click(actionTarget);
    },
    "14.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    '15.Click span "T-Premier HMO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(TPremier HMO 10100 RxEssential Formulary 515254530)").eq(2);
        };
        act.click(actionTarget);
    },
    "16.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(4);
        };
        act.click(actionTarget);
    },
    '17.Click span "STANDALONE PPO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(STANDALONE PPO Premier)").eq(2);
        };
        act.click(actionTarget);
    },
    "18.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(5);
        };
        act.click(actionTarget);
    },
    '19.Click span "Premier Plus PPO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Premier Plus PPO 2502010 Rx515254030 with infertility)").eq(2);
        };
        act.click(actionTarget);
    },
    "20.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(6);
        };
        act.click(actionTarget);
    },
    '21.Click span "STANDALONE PPO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(STANDALONE PPO Premier)").eq(5);
        };
        act.click(actionTarget);
    },
    "22.Click <i>": function () {
        var actionTarget = function () {
            return $(".dropdown.icon").eq(7);
        };
        act.click(actionTarget);
    },
    '23.Click span "Premier Plus PPO..."': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Premier Plus PPO 2502010 Rx515254030 with infertility)").eq(5);
        };
        act.click(actionTarget);
    },
    '24.Click submit button "Create"': function () {
        var actionTarget = function () {
            return $(":containsExcludeChildren(Create)").eq(1);
        };
        act.click(actionTarget);
    },
    '25.Click submit button "Send to Broker"': function () {
        act.click(":containsExcludeChildren(Send to Broker)");
    }
};

