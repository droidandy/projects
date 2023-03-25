package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class PresentationQuoteOptionListDto {
	private List<QuoteOptionBriefDto> currents = new ArrayList<>();
	private List<QuoteOptionBriefDto> renewals = new ArrayList<>();
	private List<PresentationAlternativeDto> alternatives = new ArrayList<>();

    private Float currentTotal;

    private Float renewalTotal;
    private Float renewalPercentage;

	public PresentationQuoteOptionListDto() {
	}

    public List<QuoteOptionBriefDto> getCurrents() {
        return currents;
    }

    public void setCurrents(List<QuoteOptionBriefDto> currents) {
        this.currents = currents;
    }

    public List<QuoteOptionBriefDto> getRenewals() {
        return renewals;
    }

    public void setRenewals(List<QuoteOptionBriefDto> renewals) {
        this.renewals = renewals;
    }

    public List<PresentationAlternativeDto> getAlternatives() {
        return alternatives;
    }

    public void setAlternatives(
        List<PresentationAlternativeDto> alternatives) {
        this.alternatives = alternatives;
    }

    public Float getCurrentTotal() {
        return currentTotal;
    }

    public void setCurrentTotal(Float currentTotal) {
        this.currentTotal = currentTotal;
    }

    public Float getRenewalTotal() {
        return renewalTotal;
    }

    public void setRenewalTotal(Float renewalTotal) {
        this.renewalTotal = renewalTotal;
    }

    public Float getRenewalPercentage() {
        return renewalPercentage;
    }

    public void setRenewalPercentage(Float renewalPercentage) {
        this.renewalPercentage = renewalPercentage;
    }
}
