package com.benrevo.common.dto;

public class OptionNetworkDto {
	private long rfpQuoteOptionNetworkId;
	private String origPlanName;
	private String origPlanType;
	private Float origPlanErCost;
	private Float origPlanEeCost;
	private Float origPlanTotCost;
	private String newPlanName;
	private String newPlanType;
	private Float newPlanErCost;
	private Float newPlanEeCost;
	private Float newPlanTotCost;
	private Float dollarDiff;
	private Float percentDiff;
	
	// Overview - Contributions page data
	private String erContributionFormat;
	private Float t1ErContribution;
	private Float t1EeContribution;
	private Float t1ErProposedContribution;
	private Float t1EeProposedContribution;
	private Float t1DiffEe;  // Always dollars
	private Long t1Census;
	private Long t1ProposedCensus;
	private Float t2ErContribution;
	private Float t2EeContribution;
	private Float t2ErProposedContribution;
	private Float t2EeProposedContribution;
	private Float t2DiffEe;  // Always dollars
	private Long t2Census;
	private Long t2ProposedCensus;
	private Float t3ErContribution;
	private Float t3EeContribution;
	private Float t3ErProposedContribution;
	private Float t3EeProposedContribution;
	private Float t3DiffEe;  // Always dollars
	private Long t3Census;
	private Long t3ProposedCensus;
	private Float t4ErContribution;
	private Float t4EeContribution;
	private Float t4ErProposedContribution;
	private Float t4EeProposedContribution;
	private Float t4DiffEe;  // Always dollars
	private Long t4Census;
	private Long t4ProposedCensus;
	private Float currentErMonthlyCost;
	private Float proposedErMonthlyCost;
	private Float percentDiffEr;
	private Float percentDiffEe;

	public long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public String getOrigPlanName() {
		return origPlanName;
	}

	public void setOrigPlanName(String origPlanName) {
		this.origPlanName = origPlanName;
	}

	public String getOrigPlanType() {
		return origPlanType;
	}

	public void setOrigPlanType(String origPlanType) {
		this.origPlanType = origPlanType;
	}

	public Float getOrigPlanErCost() {
		return origPlanErCost;
	}

	public Float getOrigPlanEeCost() {
		return origPlanEeCost;
	}

	public Float getOrigPlanTotCost() {
		return origPlanTotCost;
	}

	public String getNewPlanName() {
		return newPlanName;
	}

	public void setNewPlanName(String newPlanName) {
		this.newPlanName = newPlanName;
	}

	public String getNewPlanType() {
		return newPlanType;
	}

	public void setNewPlanType(String newPlanType) {
		this.newPlanType = newPlanType;
	}

	public Float getNewPlanErCost() {
		return newPlanErCost;
	}

	public Float getNewPlanEeCost() {
		return newPlanEeCost;
	}

	public Float getNewPlanTotCost() {
		return newPlanTotCost;
	}

	public Float getDollarDiff() {
		return dollarDiff;
	}

	public Float getPercentDiff() {
		return percentDiff;
	}

	public String getErContributionFormat() {
		return erContributionFormat;
	}

	public Float getT1ErContribution() {
		return t1ErContribution;
	}

	public Float getT1EeContribution() {
		return t1EeContribution;
	}

	public Float getT1ErProposedContribution() {
		return t1ErProposedContribution;
	}

	public Float getT1EeProposedContribution() {
		return t1EeProposedContribution;
	}

	public Float getT1DiffEe() {
		return t1DiffEe;
	}

	public Long getT1Census() {
		return t1Census;
	}

	public Long getT1ProposedCensus() {
		return t1ProposedCensus;
	}

	public Float getT2ErContribution() {
		return t2ErContribution;
	}

	public Float getT2EeContribution() {
		return t2EeContribution;
	}

	public Float getT2ErProposedContribution() {
		return t2ErProposedContribution;
	}

	public Float getT2EeProposedContribution() {
		return t2EeProposedContribution;
	}

	public Float getT2DiffEe() {
		return t2DiffEe;
	}

	public Long getT2Census() {
		return t2Census;
	}

	public Long getT2ProposedCensus() {
		return t2ProposedCensus;
	}

	public Float getT3ErContribution() {
		return t3ErContribution;
	}

	public Float getT3EeContribution() {
		return t3EeContribution;
	}

	public Float getT3ErProposedContribution() {
		return t3ErProposedContribution;
	}

	public Float getT3EeProposedContribution() {
		return t3EeProposedContribution;
	}

	public Float getT3DiffEe() {
		return t3DiffEe;
	}

	public Long getT3Census() {
		return t3Census;
	}

	public Long getT3ProposedCensus() {
		return t3ProposedCensus;
	}

	public Float getT4ErContribution() {
		return t4ErContribution;
	}

	public Float getT4EeContribution() {
		return t4EeContribution;
	}

	public Float getT4ErProposedContribution() {
		return t4ErProposedContribution;
	}

	public Float getT4EeProposedContribution() {
		return t4EeProposedContribution;
	}

	public Float getT4DiffEe() {
		return t4DiffEe;
	}

	public Long getT4Census() {
		return t4Census;
	}

	public Long getT4ProposedCensus() {
		return t4ProposedCensus;
	}

	public Float getCurrentErMonthlyCost() {
		return currentErMonthlyCost;
	}

	public Float getProposedErMonthlyCost() {
		return proposedErMonthlyCost;
	}

	public Float getPercentDiffEr() {
		return percentDiffEr;
	}

	public Float getPercentDiffEe() {
		return percentDiffEe;
	}

	public void setOrigPlanCosts(String contrFormat, 
		Float origT1ErContr, Float origT1Rate, Float newT1ErContr, Float newT1Rate, Long origT1Census, Long newT1Census,
		Float origT2ErContr, Float origT2Rate, Float newT2ErContr, Float newT2Rate, Long origT2Census, Long newT2Census,
		Float origT3ErContr, Float origT3Rate, Float newT3ErContr, Float newT3Rate, Long origT3Census, Long newT3Census,
		Float origT4ErContr, Float origT4Rate, Float newT4ErContr, Float newT4Rate, Long origT4Census, Long newT4Census) {
		
		this.erContributionFormat = contrFormat;
		this.t1ErContribution = (contrFormat.equals("DOLLAR") ? origT1ErContr : origT1ErContr);
		this.t1EeContribution = (contrFormat.equals("DOLLAR") ? (origT1Rate - origT1ErContr) : 100 - origT1ErContr);
		this.t1ErProposedContribution = (contrFormat.equals("DOLLAR") ? newT1ErContr : newT1ErContr);
		this.t1EeProposedContribution = (contrFormat.equals("DOLLAR") ? (newT1Rate - newT1ErContr) : 100 - newT1ErContr);
		this.t1DiffEe = (contrFormat.equals("DOLLAR") ? t1EeProposedContribution - t1EeContribution : ((origT1ErContr * origT1Rate) - (newT1ErContr * newT1Rate)));
		this.t1Census = origT1Census;
		this.t1ProposedCensus = newT1Census;
		
		this.t2ErContribution = (contrFormat.equals("DOLLAR") ? origT2ErContr : origT2ErContr);
		this.t2EeContribution = (contrFormat.equals("DOLLAR") ? (origT2Rate - origT2ErContr) : 100 - origT2ErContr);
		this.t2ErProposedContribution = (contrFormat.equals("DOLLAR") ? newT2ErContr : newT2ErContr);
		this.t2EeProposedContribution = (contrFormat.equals("DOLLAR") ? (newT2Rate - newT2ErContr) : 100 - newT2ErContr);
		this.t2DiffEe = (contrFormat.equals("DOLLAR") ? t2EeProposedContribution - t2EeContribution : ((origT2ErContr * origT2Rate) - (newT2ErContr * newT2Rate)));
		this.t2Census = origT2Census;
		this.t2ProposedCensus = newT2Census;

		this.t3ErContribution = (contrFormat.equals("DOLLAR") ? origT3ErContr : origT3ErContr);
		this.t3EeContribution = (contrFormat.equals("DOLLAR") ? (origT3Rate - origT3ErContr) : 100 - origT3ErContr);
		this.t3ErProposedContribution = (contrFormat.equals("DOLLAR") ? newT3ErContr : newT3ErContr);
		this.t3EeProposedContribution = (contrFormat.equals("DOLLAR") ? (newT3Rate - newT3ErContr) : 100 - newT3ErContr);
		this.t3DiffEe = (contrFormat.equals("DOLLAR") ? t3EeProposedContribution - t3EeContribution : ((origT3ErContr * origT3Rate) - (newT3ErContr * newT3Rate)));
		this.t3Census = origT3Census;
		this.t3ProposedCensus = newT3Census;

		this.t4ErContribution = (contrFormat.equals("DOLLAR") ? origT4ErContr : origT4ErContr);
		this.t4EeContribution = (contrFormat.equals("DOLLAR") ? (origT4Rate - origT4ErContr) : 100 - origT4ErContr);
		this.t4ErProposedContribution = (contrFormat.equals("DOLLAR") ? newT4ErContr : newT4ErContr);
		this.t4EeProposedContribution = (contrFormat.equals("DOLLAR") ? (newT4Rate - newT4ErContr) : 100 - newT4ErContr);
		this.t4DiffEe = (contrFormat.equals("DOLLAR") ? t4EeProposedContribution - t4EeContribution : ((origT4ErContr * origT4Rate) - (newT4ErContr * newT4Rate)));
		this.t4Census = origT4Census;
		this.t4ProposedCensus = newT4Census;

		// update totals
		origPlanTotCost = (origT1Rate * origT1Census) + (origT2Rate * origT2Census) + (origT3Rate * origT3Census) + (origT4Rate * origT4Census);
		origPlanErCost = contrFormat.equals("DOLLAR") ? 
			(t1ErContribution * origT1Census) + (t2ErContribution * origT2Census) + (t3ErContribution * origT3Census) + (t4ErContribution * origT4Census) : 
			((t1ErContribution * origT1Census * origT1Rate) + (t2ErContribution * origT2Census * origT2Rate) + (t3ErContribution * origT3Census * origT3Rate) + (t4ErContribution * origT4Census * origT4Rate)) / origPlanTotCost;
		origPlanEeCost = contrFormat.equals("DOLLAR") ? origPlanTotCost - origPlanErCost : 100 - origPlanErCost;	
			
		newPlanTotCost = (newT1Rate * newT1Census) + (newT2Rate * newT2Census) + (newT3Rate * newT3Census) + (newT4Rate * newT4Census);
		newPlanErCost = contrFormat.equals("DOLLAR") ? 
			(t1ErProposedContribution * newT1Census) + (t2ErProposedContribution * newT2Census) + (t3ErProposedContribution * newT3Census) + (t4ErProposedContribution * newT4Census) : 
			((t1ErProposedContribution * newT1Census * newT1Rate) + (t2ErProposedContribution * newT2Census * newT2Rate) + (t3ErProposedContribution * newT3Census * newT3Rate) + (t4ErProposedContribution * newT4Census * newT4Rate)) / newPlanTotCost;
		newPlanEeCost = contrFormat.equals("DOLLAR") ? newPlanTotCost - newPlanErCost : 100 - newPlanErCost;	

		float origCost = origPlanTotCost != null ? origPlanTotCost.floatValue() : 0f;
		float newCost = newPlanTotCost != null ? newPlanTotCost.floatValue() : 0f;
		dollarDiff = origCost - newCost;
		percentDiff = origCost == 0 ? 100f : (1 - (newCost/origCost));
	}

}
