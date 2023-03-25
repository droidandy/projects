"@mixin"["presentation.final"] = {
    '80.Click span "Final Selections"': function() {
        act.click(":containsExcludeChildren(Final Selections)");
    },
    "81.Check Final Page": function() {
        eq($(".headerTop").find(" > th:nth(0)").eq(0).text(), "medical plans - Option 2Remove");
        eq($(".headerTop").find(" > th:nth(0)").eq(1).text(), "dental plans - Option 1Remove");
        eq($(".headerTop").find(" > th:nth(0)").eq(2).text(), "vision plans - Option 1Remove");
    },
    '82.Click submit button "Send to Carrier..."': function() {
        act.click(":containsExcludeChildren(Send to Carrier for Approval)");
    },
    "83.Check submit": function() {
        ok($("[alt='success']").length > 0, "Check icon");
    },
    "85.Wait 10000 milliseconds": function() {
        act.wait(1e4);
    }
};

