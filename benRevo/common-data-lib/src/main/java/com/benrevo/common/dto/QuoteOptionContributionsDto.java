package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class QuoteOptionContributionsDto {
	
	private Long rfpQuoteOptionNetworkId;
	private String carrier;
	private String planNameByNetwork;
	private String planType;
	private String currentPlan;
	private String currentContrFormat;
	private String proposedContrFormat;
	private Float currentERTotal;
	private Float proposedERTotal;
	private Long currentEnrollmentTotal;
	private Long proposedEnrollmentTotal;
	// FIXME incorrect name: rename to employerFundTotal
	private Float fundEETotal;
	private Float currentERTotalCost;
	private Float proposedERTotalCost;
	private Float changeProposedERCost;
	private Float changeProposedEECost;
	private boolean kaiserNetwork;
	private List<QuoteOptionPlanContributionDto> contributions;
	
	public QuoteOptionContributionsDto() {
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

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	public List<QuoteOptionPlanContributionDto> getContributions() {
		if (contributions == null) {
			contributions = new ArrayList<>();
		}
		return contributions;
	}

	public void setContributions(List<QuoteOptionPlanContributionDto> contributions) {
		this.contributions = contributions;
	}
	
	public String getCurrentContrFormat() {
		return currentContrFormat;
	}

	public void setCurrentContrFormat(String currentContrFormat) {
		this.currentContrFormat = currentContrFormat;
	}

	public String getProposedContrFormat() {
		return proposedContrFormat;
	}

	public void setProposedContrFormat(String proposedContrFormat) {
		this.proposedContrFormat = proposedContrFormat;
	}

	public Float getCurrentERTotal() {
		return currentERTotal;
	}

	public void setCurrentERTotal(Float currentERTotal) {
		this.currentERTotal = currentERTotal;
	}

	public Float getProposedERTotal() {
		return proposedERTotal;
	}

	public void setProposedERTotal(Float proposedERTotal) {
		this.proposedERTotal = proposedERTotal;
	}
/*
	public Float getProposedEETotal() {
		return proposedEETotal;
	}

	public void setProposedEETotal(Float proposedEETotal) {
		this.proposedEETotal = proposedEETotal;
	}
*/
	public Float getCurrentERTotalCost() {
		return currentERTotalCost;
	}

	public void setCurrentERTotalCost(Float currentERTotalCost) {
		this.currentERTotalCost = currentERTotalCost;
	}

	public Float getProposedERTotalCost() {
		return proposedERTotalCost;
	}

	public void setProposedERTotalCost(Float proposedERTotalCost) {
		this.proposedERTotalCost = proposedERTotalCost;
	}

	public Float getChangeProposedERCost() {
		return changeProposedERCost;
	}

	public void setChangeProposedERCost(Float changeProposedERCost) {
		this.changeProposedERCost = changeProposedERCost;
	}

	public Float getChangeProposedEECost() {
		return changeProposedEECost;
	}

	public void setChangeProposedEECost(Float changeProposedEECost) {
		this.changeProposedEECost = changeProposedEECost;
	}

	public Float getFundEETotal() {
		return fundEETotal;
	}

	public void setFundEETotal(Float fundEETotal) {
		this.fundEETotal = fundEETotal;
	}

	public String getCurrentPlan() {
		return currentPlan;
	}

	public void setCurrentPlan(String currentPlan) {
		this.currentPlan = currentPlan;
	}

	public Long getCurrentEnrollmentTotal() {
		return currentEnrollmentTotal;
	}

	public void setCurrentEnrollmentTotal(Long currentEnrollmentTotal) {
		this.currentEnrollmentTotal = currentEnrollmentTotal;
	}

	public Long getProposedEnrollmentTotal() {
		return proposedEnrollmentTotal;
	}

	public void setProposedEnrollmentTotal(Long proposedEnrollmentTotal) {
		this.proposedEnrollmentTotal = proposedEnrollmentTotal;
	}

	public boolean isKaiserNetwork() {
		return kaiserNetwork;
	}

	public void setKaiserNetwork(boolean kaiserNetwork) {
		this.kaiserNetwork = kaiserNetwork;
	}

}
