package com.benrevo.be.modules.salesforce.enums;

public enum SalesforceObject {
    Account,
    Opportunity,
    Contact;

    @Override
    public String toString() {
        return this.name();
    }
}
