package com.benrevo.common.dto;


import java.util.List;

public class QuoteOptionNetworkRidersDto {

    private Long rfpQuoteOptionNetworkId;

    private String carrier;
    
    private Long carrierId;
    
    private Long administrativeFeeId;

    private String planNameByNetwork;

    private String networkType;

    private List<RiderDto> riders;

    public QuoteOptionNetworkRidersDto() {
    }

    public Long getRfpQuoteOptionNetworkId() {
        return rfpQuoteOptionNetworkId;
    }

    public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
        this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getPlanNameByNetwork() {
        return planNameByNetwork;
    }

    public void setPlanNameByNetwork(String planNameByNetwork) {
        this.planNameByNetwork = planNameByNetwork;
    }

    public String getNetworkType() {
        return networkType;
    }

    public void setNetworkType(String networkType) {
        this.networkType = networkType;
    }

    public List<RiderDto> getRiders() {
        return riders;
    }

    public void setRiders(List<RiderDto> riders) {
        this.riders = riders;
    }

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}

	public Long getAdministrativeFeeId() {
		return administrativeFeeId;
	}

	public void setAdministrativeFeeId(Long administrativeFeeId) {
		this.administrativeFeeId = administrativeFeeId;
	}    
}
