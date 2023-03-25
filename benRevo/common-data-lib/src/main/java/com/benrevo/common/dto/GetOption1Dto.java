package com.benrevo.common.dto;

import com.benrevo.common.enums.QuoteType;

/**
 * Created by lemdy on 7/8/17.
 */
public class GetOption1Dto {

    private Long pnnId;
    private String planType;
    private Long planId;
    private Long clientPlanId;
    private String rfpQuoteNetwork;
    private QuoteType quoteType;
    private boolean isKaiser;
    private String networkGroup;

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getRfpQuoteNetwork() {
        return rfpQuoteNetwork;
    }

    public void setRfpQuoteNetwork(String rfpQuoteNetwork) {
        this.rfpQuoteNetwork = rfpQuoteNetwork;
    }

    public Long getClientPlanId() {
        return clientPlanId;
    }

    public void setClientPlanId(Long clientPlanId) {
        this.clientPlanId = clientPlanId;
    }

    public QuoteType getQuoteType() {
        return quoteType;
    }

    public void setQuoteType(QuoteType quoteType) {
        this.quoteType = quoteType;
    }

    public boolean isKaiser() {
        return isKaiser;
    }

    public void setKaiser(boolean kaiser) {
        isKaiser = kaiser;
    }

    public Long getPnnId() {
        return pnnId;
    }

    public void setPnnId(Long pnnId) {
        this.pnnId = pnnId;
    }

    public String getNetworkGroup() {
        return networkGroup;
    }

    public void setNetworkGroup(String networkGroup) {
        this.networkGroup = networkGroup;
    }
}
