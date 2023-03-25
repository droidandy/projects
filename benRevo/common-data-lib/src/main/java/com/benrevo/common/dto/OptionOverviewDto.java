package com.benrevo.common.dto;

import java.util.List;
import java.util.Map;

public class OptionOverviewDto {
	private long rfpQuoteOptionId;
	private String optionName;
	private String origCarrier;
	private Float origErCost;
	private Float origEeCost;
	private Float origTotCost;
	private String newCarrier;
	private Float newErCost;
	private Float newEeCost;
	private Float newTotCost;
	private Float dollarDiff;
	private Float percentDiff;
	private List<OptionNetworkDto> optionNetworks;
	private Map<String, Long> addPlanOptions; 

	public long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

	public String getOptionName() {
		return optionName;
	}

	public void setOptionName(String optionName) {
		this.optionName = optionName;
	}

	public String getOrigCarrier() {
		return origCarrier;
	}

	public void setOrigCarrier(String origCarrier) {
		this.origCarrier = origCarrier;
	}

	public String getNewCarrier() {
		return newCarrier;
	}

	public void setNewCarrier(String newCarrier) {
		this.newCarrier = newCarrier;
	}

	public List<OptionNetworkDto> getOptionNetworks() {
		return optionNetworks;
	}

	public void setOptionNetworks(List<OptionNetworkDto> optionNetworks) {
		this.optionNetworks = optionNetworks;
		updateTotCost();
	}

	public Float getOrigErCost() {
		return origErCost;
	}

	public Float getOrigEeCost() {
		return origEeCost;
	}

	public Float getOrigTotCost() {
		return origTotCost;
	}

	public Float getNewErCost() {
		return newErCost;
	}

	public Float getNewEeCost() {
		return newEeCost;
	}

	public Float getNewTotCost() {
		return newTotCost;
	}

	public Float getDollarDiff() {
		return dollarDiff;
	}

	public Float getPercentDiff() {
		return percentDiff;
	}
	
	public Map<String, Long> getAddPlanOptions() {
		return addPlanOptions;
	}

	public void setAddPlanOptions(Map<String, Long> addPlanOptions) {
		this.addPlanOptions = addPlanOptions;
	}

	private void updateTotCost() {
		origErCost = origEeCost = origTotCost = newErCost = newEeCost = newTotCost = 0f;
		if (optionNetworks != null) {
			for (OptionNetworkDto ond : optionNetworks) {
				origErCost += toFloat(ond.getOrigPlanErCost());
				origEeCost += toFloat(ond.getOrigPlanEeCost());
				origTotCost += toFloat(ond.getOrigPlanTotCost());
				newErCost += toFloat(ond.getNewPlanErCost());
				newEeCost += toFloat(ond.getNewPlanEeCost());
				newTotCost += toFloat(ond.getNewPlanTotCost());
			}
		}

		dollarDiff = origTotCost - newTotCost;
		percentDiff = origTotCost == 0 ? 100f : (1 - (newTotCost/origTotCost));
	}

	private Float toFloat(Float f) {
		return f == null ? 0 : f.floatValue();
	}

	public long findQuoteOptionNetworkByType(String type) {
		for (OptionNetworkDto ond : optionNetworks) {
			if (ond.getNewPlanType().equals(type)) {
				return ond.getRfpQuoteOptionNetworkId();
			}
		}
		return 0;
	}
	
}
