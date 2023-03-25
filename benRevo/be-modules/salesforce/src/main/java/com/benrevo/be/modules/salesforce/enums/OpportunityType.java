package com.benrevo.be.modules.salesforce.enums;

/**
 * Created by ebrandell on 11/29/17 at 11:03 PM.
 */
public enum OpportunityType {
    NewBusiness("New Business"),
    ExistingBusiness("Existing Business");

    String type;

    OpportunityType(String type) {
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
