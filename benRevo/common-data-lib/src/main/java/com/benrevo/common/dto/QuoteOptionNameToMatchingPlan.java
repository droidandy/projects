package com.benrevo.common.dto;

/**
 * Created by lemdy on 7/26/17.
 */
public class QuoteOptionNameToMatchingPlan {
    private String quoteOptionName;
    private Long pnnId;

    private String previousQuoteOptionName;
    private String networkGroup;

    public String getQuoteOptionName() {
        return quoteOptionName;
    }

    public void setQuoteOptionName(String quoteOptionName) {
        this.quoteOptionName = quoteOptionName;
    }

    public Long getPnnId() {
        return pnnId;
    }

    public void setPnnId(Long pnnId) {
        this.pnnId = pnnId;
    }

    public String getPreviousQuoteOptionName() {
        return previousQuoteOptionName;
    }

    public void setPreviousquoteOptionName(String previousQuoteOptionName) {
        this.previousQuoteOptionName = previousQuoteOptionName;
    }

    public String getNetworkGroup() {
      return networkGroup;
    }

    public void setNetworkGroup(String networkGroup) {
      this.networkGroup = networkGroup;
    }

}
