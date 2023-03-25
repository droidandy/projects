package com.benrevo.be.modules.salesforce.enums;

/**
 * Created by ebrandell on 2/9/18 at 12:43 PM.
 */
public enum ContactType {
    Advisor,
    Broker,
    Carrier,
    Investor;

    @Override
    public String toString() {
        return name();
    }
}
