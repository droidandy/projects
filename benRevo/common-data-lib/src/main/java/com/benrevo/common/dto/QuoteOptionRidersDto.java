package com.benrevo.common.dto;

import java.util.List;

public class QuoteOptionRidersDto {

    private Long rfpQuoteOptionId;

    private String carrier;

    private List<RiderDto> riders;

    private List<QuoteOptionNetworkRidersDto> networkRidersDtos;

    public Long getRfpQuoteOptionId() {
        return rfpQuoteOptionId;
    }

    public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
        this.rfpQuoteOptionId = rfpQuoteOptionId;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public List<RiderDto> getRiders() {
        return riders;
    }

    public void setRiders(List<RiderDto> riders) {
        this.riders = riders;
    }

    public List<QuoteOptionNetworkRidersDto> getNetworkRidersDtos() {
        return networkRidersDtos;
    }

    public void setNetworkRidersDtos(List<QuoteOptionNetworkRidersDto> networkRidersDtos) {
        this.networkRidersDtos = networkRidersDtos;
    }
}
