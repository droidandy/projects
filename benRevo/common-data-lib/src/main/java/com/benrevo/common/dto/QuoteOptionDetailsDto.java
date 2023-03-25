package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

import com.benrevo.common.enums.QuoteType;

public class QuoteOptionDetailsDto {
	private Long id; // rfpQuoteOptionId
	private String name;
	private String displayName;
	private Float totalAnnualPremium;
	private Float currentPlanAnnual; // current plan annual total without employer fund
	private Float newPlanAnnual; // proposed plan annual total without employer fund 
	private Float percentDifference;
	private Float dollarDifference;
	private List<QuoteOptionPlanBriefDto> overviewPlans = new ArrayList<>();
	private List<QuoteOptionPlanDetailsDto> detailedPlans = new ArrayList<>();
	private QuoteType quoteType;
	private Long quoteId;
	private Float maxBundleDiscount; // summ of Dental and Vision discounts
	
	public QuoteOptionDetailsDto() {
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Float getTotalAnnualPremium() {
		return totalAnnualPremium;
	}
	public void setTotalAnnualPremium(Float totalAnnualPremium) {
		this.totalAnnualPremium = totalAnnualPremium;
	}
	public Float getCurrentPlanAnnual() {
		return currentPlanAnnual;
	}
	public void setCurrentPlanAnnual(Float currentPlanAnnual) {
		this.currentPlanAnnual = currentPlanAnnual;
	}
	public Float getNewPlanAnnual() {
		return newPlanAnnual;
	}
	public void setNewPlanAnnual(Float newPlanAnnual) {
		this.newPlanAnnual = newPlanAnnual;
	}
	public Float getPercentDifference() {
		return percentDifference;
	}
	public void setPercentDifference(Float percentDifference) {
		this.percentDifference = percentDifference;
	}
	public Float getDollarDifference() {
		return dollarDifference;
	}
	public void setDollarDifference(Float dollarDifference) {
		this.dollarDifference = dollarDifference;
	}
	public List<QuoteOptionPlanBriefDto> getOverviewPlans() {
		return overviewPlans;
	}
	public void setOverviewPlans(List<QuoteOptionPlanBriefDto> overviewPlans) {
		this.overviewPlans = overviewPlans;
	}
	public List<QuoteOptionPlanDetailsDto> getDetailedPlans() {
		return detailedPlans;
	}
	public void setDetailedPlans(List<QuoteOptionPlanDetailsDto> detailedPlans) {
		this.detailedPlans = detailedPlans;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}

	public Float getMaxBundleDiscount() {
		return maxBundleDiscount;
	}

	public void setMaxBundleDiscount(Float maxBundleDiscount) {
		this.maxBundleDiscount = maxBundleDiscount;
	}

	public Long getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(Long quoteId) {
		this.quoteId = quoteId;
	}

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}