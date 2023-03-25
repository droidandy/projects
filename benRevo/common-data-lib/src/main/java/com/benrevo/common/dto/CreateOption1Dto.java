package com.benrevo.common.dto;

import com.benrevo.common.enums.OptionType;
import javax.validation.constraints.NotNull;
import java.util.Map;

public class CreateOption1Dto {

    @NotNull
    private Map<Long, QuoteOptionNameToMatchingPlan> clientPlanToNetwork;

    @NotNull
    private Long rfpQuoteId;

    @NotNull
    private String category;

    @NotNull
    private OptionType optionType;


    public Map<Long, QuoteOptionNameToMatchingPlan> getClientPlanToNetwork() {
        return clientPlanToNetwork;
    }

    public void setClientPlanToNetwork(Map<Long, QuoteOptionNameToMatchingPlan> clientPlanToNetwork) {
        this.clientPlanToNetwork = clientPlanToNetwork;
    }

    public Long getRfpQuoteId() {
        return rfpQuoteId;
    }

    public void setRfpQuoteId(Long rfpQuoteId) {
        this.rfpQuoteId = rfpQuoteId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public OptionType getOptionType() {
        return optionType;
    }

    public void setOptionType(OptionType optionType) {
        this.optionType = optionType;
    }
}
