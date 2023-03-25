"@mixin"["admin.client.notes"] = {
    "127.Wait 10000 milliseconds": function() {
        act.wait(1e4);
    },
    '128.Click submit button "Add Notes"': function() {
        act.click(".ui.medium.primary.button[name='medical-summary-add']");
    },
    "129.Type in text area": function() {
        var actionTarget = function() {
            return $(".ui.small.modal.transition.visible.active.summary-modal").find(" > textarea:nth(0)");
        };
        act.type(actionTarget, "Test Medical");
    },
    '130.Click submit button "ADD NOTES"': function() {
        act.click(":containsExcludeChildren(ADD NOTES)");
    },
    '131.Click submit button "Add Notes"': function() {
        act.click(".ui.medium.primary.button[name='kaiser-summary-add']");
    },
    "132.Type in text area": function() {
        var actionTarget = function() {
            return $(".ui.small.modal.transition.visible.active.summary-modal").find(" > textarea:nth(0)");
        };
        act.type(actionTarget, "Kaiser Test");
    },
    '133.Click submit button "ADD NOTES"': function() {
        act.click(":containsExcludeChildren(ADD NOTES)");
    },
    '134.Click submit button "Add Notes"': function() {
        act.click(".ui.medium.primary.button[name='dental-summary-add']");
    },
    "135.Type in text area": function() {
        var actionTarget = function() {
            return $(".ui.small.modal.transition.visible.active.summary-modal").find(" > textarea:nth(0)");
        };
        act.type(actionTarget, "Dental Test");
    },
    '136.Click submit button "ADD NOTES"': function() {
        act.click(":containsExcludeChildren(ADD NOTES)");
    },
    '137.Click submit button "Add Notes"': function() {
        act.click(".ui.medium.primary.button[name='vision-summary-add']");
    },
    "138.Type in text area": function() {
        var actionTarget = function() {
            return $(".ui.small.modal.transition.visible.active.summary-modal").find(" > textarea:nth(0)");
        };
        act.type(actionTarget, "Vision Test");
    },
    '139.Click submit button "ADD NOTES"': function() {
        act.click(":containsExcludeChildren(ADD NOTES)");
    },
    '140.Click submit button "Upload"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload)").eq(2);
        };
        act.click(actionTarget);
    },
    '141.Upload "2017 Prospect Sierra School - No Cal Quote Exhibit.xlsx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone").find(" > input:nth(0)").eq(1);
        };
        act.upload(actionTarget, "./uploads/2017 Prospect Sierra School - No Cal Quote Exhibit.xlsx");
    },
    '142.Click submit button "Upload"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload)").eq(3);
        };
        act.click(actionTarget);
    },
    '143.Upload "2017 Astreya Partners, Inc. - No Cal Alongside Kaiser No GRx Quote Exhibits.xlsx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone").find(" > input:nth(0)").eq(3);
        };
        act.upload(actionTarget, "./uploads/2017 Astreya Partners, Inc. - No Cal Alongside Kaiser No GRx Quote Exhibits.xlsx");
    },
    '144.Click submit button "Upload"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload)").eq(4);
        };
        act.click(actionTarget);
    },
    '145.Upload "D_DualOptionDPPO_fast.xlsx" file': function() {
        var actionTarget = function() {
            return $(".drop-zone").find(" > input:nth(0)").eq(5);
        };
        act.upload(actionTarget, "./uploads/D_DualOptionDPPO_fast.xlsx");
    },
    '146.Click submit button "Upload"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Upload)").eq(5);
        };
        act.click(actionTarget);
    },
    '147.Upload "V_DualOption.xlsm" file': function() {
        var actionTarget = function() {
            return $(".drop-zone").find(" > input:nth(0)").eq(7);
        };
        act.upload(actionTarget, "./uploads/V_DualOption.xlsm");
    },
    "148.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(0);
        };
        act.click(actionTarget);
    },
    "149.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "150.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(1);
        };
        act.click(actionTarget);
    },
    "151.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "152.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(2);
        };
        act.click(actionTarget);
    },
    "153.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "154.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(3);
        };
        act.click(actionTarget);
    },
    "155.Click div": function() {
        var actionTarget = function() {
            return $(".menu.transition.visible").find(" > div:nth(1)");
        };
        act.click(actionTarget);
    },
    "156.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(4);
        };
        act.click(actionTarget);
    },
    '157.Click span "Options PPO..."': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Options PPO 20PlanNEW3940900127 CS1)").eq(2);
        };
        act.click(actionTarget);
    },
    "158.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(5);
        };
        act.click(actionTarget);
    },
    '159.Click span "Options PPO..."': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Options PPO 20PlanNEW3940900127 CS1)").eq(5);
        };
        act.click(actionTarget);
    },
    "160.Click <i>": function() {
        var actionTarget = function() {
            return $(".dropdown.icon").eq(6);
        };
        act.click(actionTarget);
    },
    "161.Click div": function() {
        var actionTarget = function() {
            return $(".selected.item").eq(7);
        };
        act.click(actionTarget);
    },
    '162.Click submit button "Create"': function() {
        var actionTarget = function() {
            return $(":containsExcludeChildren(Create)").eq(1);
        };
        act.click(actionTarget);
    },
    '163.Click submit button "Send to Broker"': function() {
        act.click(":containsExcludeChildren(Send to Broker)");
    }
};

