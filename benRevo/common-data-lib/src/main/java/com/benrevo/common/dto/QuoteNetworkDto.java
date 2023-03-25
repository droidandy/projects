package com.benrevo.common.dto;

import java.util.List;

public class QuoteNetworkDto {

    private String rfpQuoteNetwork;

    private List<QuoteNetworkPlanDto> quoteNetworkPlans;

    private List<QuoteNetworkPlanDto> matchQuoteNetworkPlans;
    
    public String getRfpQuoteNetwork() {
        return rfpQuoteNetwork;
    }

    public void setRfpQuoteNetwork(String rfpQuoteNetwork) {
        this.rfpQuoteNetwork = rfpQuoteNetwork;
    }

    public List<QuoteNetworkPlanDto> getQuoteNetworkPlans() {
        return quoteNetworkPlans;
    }

    public void setQuoteNetworkPlans(List<QuoteNetworkPlanDto> quoteNetworkPlans) {
        this.quoteNetworkPlans = quoteNetworkPlans;
    }

    public List<QuoteNetworkPlanDto> getMatchQuoteNetworkPlans() {
        return matchQuoteNetworkPlans;
    }

    public void setMatchQuoteNetworkPlans(List<QuoteNetworkPlanDto> matchQuoteNetworkPlans) {
        this.matchQuoteNetworkPlans = matchQuoteNetworkPlans;
    }
       
}
