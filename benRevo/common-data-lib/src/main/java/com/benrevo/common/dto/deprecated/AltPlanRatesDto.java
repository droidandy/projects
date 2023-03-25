package com.benrevo.common.dto.deprecated;

public class AltPlanRatesDto {

	private long pnnId; 
	private String planName;
	private long tier1;
	private long tier2;
	private long tier4;
	private long tier3;
	private boolean lead;
	private boolean finalSelected;
	
	public long getPnnId() {
		return pnnId;
	}
	
	public void setPnnId(long pnnId) {
		this.pnnId = pnnId;
	}
	
	public String getPlanName() {
		return planName;
	}
	
	public void setPlanName(String planName) {
		this.planName = planName;
	}
	
	public long getTier1() {
		return tier1;
	}
	
	public void setTier1(long tier1) {
		this.tier1 = tier1;
	}
	
	public long getTier2() {
		return tier2;
	}
	
	public void setTier2(long tier2) {
		this.tier2 = tier2;
	}
	
	public long getTier4() {
		return tier4;
	}
	
	public void setTier4(long tier4) {
		this.tier4 = tier4;
	}
	
	public long getTier3() {
		return tier3;
	}
	
	public void setTier3(long tier3) {
		this.tier3 = tier3;
	}
	
	public boolean isLead() {
		return lead;
	}
	
	public void setLead(boolean lead) {
		this.lead = lead;
	}
	
	public boolean isFinalSelected() {
		return finalSelected;
	}
	
	public void setFinalSelected(boolean finalSelected) {
		this.finalSelected = finalSelected;
	}
}
