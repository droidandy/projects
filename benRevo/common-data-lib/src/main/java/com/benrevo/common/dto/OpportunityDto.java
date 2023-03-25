package com.benrevo.common.dto;

import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;

public class OpportunityDto {
    // Login info
    private String salesforceLoginUrl;
    private String salesforceUsername;
    private String salesforcePassword;
    private String salesforceConsumerKey;
    private String salesforceConsumerSecret;

    // Create info
    private String salesforceCarrierUrl;
    private String opportunityJson;
    private String salesforceId;
    @JsonProperty("groupId")
    private long clientId;
    private long rfpCarrierId;
    private String tierValuesCsv;
    private Map<String, byte[]> benefitSummaryFile;
    private Map<String, byte[]> censusFile;

    public OpportunityDto(String loginUrl, String username, String password, String consumerKey,
                          String consumerSecret, String carrierUrl, String opportunityJson, long clientId, long rfpCarrierId) {
        this.salesforceLoginUrl = loginUrl;
        this.salesforceUsername = username;
        this.salesforcePassword = password;
        this.salesforceConsumerKey = consumerKey;
        this.salesforceConsumerSecret = consumerSecret;
        this.salesforceCarrierUrl = carrierUrl;
        this.opportunityJson = opportunityJson;
        this.clientId = clientId;
        this.rfpCarrierId = rfpCarrierId;
    }

    public String getSalesforceLoginUrl() {
        return salesforceLoginUrl;
    }

    public String getSalesforceUsername() {
        return salesforceUsername;
    }

    public String getSalesforcePassword() {
        return salesforcePassword;
    }

    public String getSalesforceConsumerKey() {
        return salesforceConsumerKey;
    }

    public String getSalesforceConsumerSecret() {
        return salesforceConsumerSecret;
    }

    public String getSalesforceCarrierUrl() {
        return salesforceCarrierUrl;
    }

    public long getClientId() {
        return clientId;
    }

    public long getRfpCarrierId() {
        return rfpCarrierId;
    }

    public void setOpportunityJson(String opportunityJson) {
        this.opportunityJson = opportunityJson;
    }

    public String getOpportunityJson() {
        return opportunityJson;
    }

    public void setSalesforceId(String id) {
        this.salesforceId = id;
    }

    public String getSalesforceId() {
        return salesforceId;
    }

    public void setTierValuesCsv(String tierValuesCsv) {
        this.tierValuesCsv = tierValuesCsv;
    }

    public String getTierValuesCsv() {
        return tierValuesCsv;
    }

    public void setBenefitSummaryFile(Map<String, byte[]> benefitSummaryFile) {
        this.benefitSummaryFile = benefitSummaryFile;
    }

    public Map<String, byte[]> getBenefitSummaryFile() {
        return benefitSummaryFile;
    }

    public void setCensusFile(Map<String, byte[]> censusFile) {
        this.censusFile = censusFile;
    }

    public Map<String, byte[]> getCensusFile() {
        return censusFile;
    }
}
