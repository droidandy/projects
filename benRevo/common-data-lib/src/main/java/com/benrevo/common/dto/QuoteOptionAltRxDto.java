package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;

public class QuoteOptionAltRxDto {
	
	private Long rfpQuoteNetworkPlanId;
	private String name;
	private String type; // current | primaryPlan | alternative
	private boolean selected = false;
    private boolean secondSelected = false;
	private String carrier;
	private List<Rx> rx = new ArrayList<>();
	public QuoteOptionAltRxDto() {
	}
	
	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}
	
	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getCarrier() {
		return carrier;
	}
	
	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}
	
	public List<Rx> getRx() {
		return rx;
	}
	
	public void setRx(List<Rx> rx) {
		this.rx = rx;
	}

    public boolean isSecondSelected() {
        return secondSelected;
    }

    public void setSecondSelected(boolean secondSelected) {
        this.secondSelected = secondSelected;
    }
}
