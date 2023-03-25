package com.benrevo.common.enums;

public enum BrokerConfigType {
    // broker language to be included with every RFP 
    // (i.e., compensation disclosure, confidentiality notice, quote requirements, etc.)
    LANGUAGE,
    CARRIER_EMAILS; // contains json-array representation of List<RfpSubmissionDto.CarrierToEmails> objects
}
