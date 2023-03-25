package com.benrevo.common.dto;

public class QuoteOptionPlanDetailsDto {
	private Long rfpQuoteOptionNetworkId;
	private Long rfpQuoteNetworkId;
	private Long rfpQuoteNetworkRxPlanId;
    private Long rfpQuoteNetworkPlanId;
    private Long secondRfpQuoteNetworkRxPlanId;
    private Long secondRfpQuoteNetworkPlanId;
	private boolean kaiserNetwork;
	private boolean outOfState;
	private String carrier;
	private Long carrierId;
	private Long rfpCarrierId;
	private String type;
	private String networkName;
    private Long networkId;
	private Float dollarDifference;
	private Float percentDifference;
	private Float employerFund;
	private Float administrativeFee;
	private String discountType;
	private QuoteOptionPlanBriefDto currentPlan;
	private QuoteOptionPlanBriefDto newPlan;
    private QuoteOptionPlanBriefDto secondNewPlan;

	public QuoteOptionPlanDetailsDto() {
	}

    public Long getRfpQuoteNetworkRxPlanId() {
        return rfpQuoteNetworkRxPlanId;
    }

    public void setRfpQuoteNetworkRxPlanId(Long rfpQuoteNetworkRxPlanId) {
        this.rfpQuoteNetworkRxPlanId = rfpQuoteNetworkRxPlanId;
    }

    public Long getSecondRfpQuoteNetworkRxPlanId() {
        return secondRfpQuoteNetworkRxPlanId;
    }

    public void setSecondRfpQuoteNetworkRxPlanId(Long secondRfpQuoteNetworkRxPlanId) {
        this.secondRfpQuoteNetworkRxPlanId = secondRfpQuoteNetworkRxPlanId;
    }

    public Long getRfpQuoteNetworkPlanId() {
        return rfpQuoteNetworkPlanId;
    }

    public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
        this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
    }

    public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}

	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public boolean isKaiserNetwork() {
		return kaiserNetwork;
	}

	public void setKaiserNetwork(boolean kaiserNetwork) {
		this.kaiserNetwork = kaiserNetwork;
	}

	public String getCarrier() {
		return carrier;
	}
	
	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNetworkName() {
		return networkName;
	}

	public void setNetworkName(String networkName) {
		this.networkName = networkName;
	}

	public Float getDollarDifference() {
		return dollarDifference;
	}
	
	public void setDollarDifference(Float dollarDifference) {
		this.dollarDifference = dollarDifference;
	}
	
	public Float getPercentDifference() {
		return percentDifference;
	}
	
	public void setPercentDifference(Float percentDifference) {
		this.percentDifference = percentDifference;
	}
	
	public QuoteOptionPlanBriefDto getCurrentPlan() {
		return currentPlan;
	}
	
	public void setCurrentPlan(QuoteOptionPlanBriefDto currentPlan) {
		this.currentPlan = currentPlan;
	}
	
	public QuoteOptionPlanBriefDto getNewPlan() {
		return newPlan;
	}
	
	public void setNewPlan(QuoteOptionPlanBriefDto newPlan) {
		this.newPlan = newPlan;
	}

	public Long getRfpCarrierId() {
		return rfpCarrierId;
	}

	public void setRfpCarrierId(Long rfpCarrierId) {
		this.rfpCarrierId = rfpCarrierId;
	}

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}

	public Float getEmployerFund() {
		return employerFund;
	}

	public void setEmployerFund(Float employerFund) {
		this.employerFund = employerFund;
	}

	public boolean isOutOfState() {
		return outOfState;
	}

	public void setOutOfState(boolean outOfState) {
		this.outOfState = outOfState;
	}

	public Float getAdministrativeFee() {
		return administrativeFee;
	}

	public void setAdministrativeFee(Float administrativeFee) {
		this.administrativeFee = administrativeFee;
	}

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public Long getNetworkId() {
        return networkId;
    }

    public void setNetworkId(Long networkId) {
        this.networkId = networkId;
    }

    public Long getSecondRfpQuoteNetworkPlanId() {
        return secondRfpQuoteNetworkPlanId;
    }

    public void setSecondRfpQuoteNetworkPlanId(Long secondRfpQuoteNetworkPlanId) {
        this.secondRfpQuoteNetworkPlanId = secondRfpQuoteNetworkPlanId;
    }

    public QuoteOptionPlanBriefDto getSecondNewPlan() {
        return secondNewPlan;
    }

    public void setSecondNewPlan(QuoteOptionPlanBriefDto secondNewPlan) {
        this.secondNewPlan = secondNewPlan;
    }
}
