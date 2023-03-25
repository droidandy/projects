package com.benrevo.be.modules.salesforce.dto;

import com.benrevo.common.enums.CarrierType;
import com.benrevo.be.modules.salesforce.enums.SalesforceObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * Created by ebrandell on 11/9/17 at 3:38 PM.
 */
public class SFBase {

    @JsonIgnore
    protected SalesforceObject sObjectType;

    @JsonIgnore
    protected String currentName;

    @JsonProperty("Name")
    protected String name;

    @JsonProperty("Test__c")
    protected Boolean test;

    @JsonProperty("Carrier__c")
    protected CarrierType carrier;

    public SFBase() {}

    public SalesforceObject getsObjectType() {
        return sObjectType;
    }

    public void setsObjectType(SalesforceObject sObjectType) {
        this.sObjectType = sObjectType;
    }

    public String getCurrentName() {
        return currentName;
    }

    public void setCurrentName(String currentName) {
        this.currentName = currentName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getTest() {
        return test;
    }

    public void setTest(Boolean test) {
        this.test = test;
    }

    public CarrierType getCarrier() {
        return carrier;
    }

    public void setCarrier(CarrierType carrier) {
        this.carrier = carrier;
    }
}
