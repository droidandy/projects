package com.benrevo.be.modules.salesforce.enums;

public enum AccountType {
    BrokerageFirm("Brokerage Firm"),
    Employer("Employer"),
    InsuranceCarrier("Insurance Carrier"),
    Investor("Investor"),
    Advisor("Advisor");

    String type;

    AccountType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return type;
    }
}
