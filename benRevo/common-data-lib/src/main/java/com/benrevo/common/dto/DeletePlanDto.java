package com.benrevo.common.dto;


import javax.validation.constraints.NotNull;
import java.util.List;

public class DeletePlanDto {

    @NotNull
    private Long rfpQuoteNetworkId;
    @NotNull
    private List<Long> rfpQuoteNetworkPlanIds;

    public Long getRfpQuoteNetworkId() {
        return rfpQuoteNetworkId;
    }

    public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
        this.rfpQuoteNetworkId = rfpQuoteNetworkId;
    }

    public List<Long> getRfpQuoteNetworkPlanIds() {
        return rfpQuoteNetworkPlanIds;
    }

    public void setRfpQuoteNetworkPlanIds(List<Long> rfpQuoteNetworkPlanIds) {
        this.rfpQuoteNetworkPlanIds = rfpQuoteNetworkPlanIds;
    }
}
