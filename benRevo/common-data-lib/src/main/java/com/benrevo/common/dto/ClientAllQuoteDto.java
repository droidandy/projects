package com.benrevo.common.dto;

import java.util.List;

public class ClientAllQuoteDto {

    private Float totalAnnualPremium;
    private Float projectedBundleDiscount;
    private Float projectedBundleDiscountPercent;
    private String premiumCredit;
    private Float totalAnnualPremiumWithDiscount;
    
    private Boolean dentalDiscount;
    private Boolean visionDiscount;
    private Boolean lifeDiscount;
    private Boolean stdDiscount;
    private Boolean ltdDiscount;


    private ClientRateBankDto medicalQuote;
    private ClientRateBankDto kaiserQuote;
    private ClientRateBankDto dentalQuote;
    private ClientRateBankDto visionQuote;
    
    private List<ClientMemberDto> clientMembers;

    public Float getTotalAnnualPremium() {
        return totalAnnualPremium;
    }

    public void setTotalAnnualPremium(Float totalAnnualPremium) {
        this.totalAnnualPremium = totalAnnualPremium;
    }

    public Float getProjectedBundleDiscount() {
        return projectedBundleDiscount;
    }

    public void setProjectedBundleDiscount(Float projectedBundleDiscount) {
        this.projectedBundleDiscount = projectedBundleDiscount;
    }

    public String getPremiumCredit() {
        return premiumCredit;
    }

    public void setPremiumCredit(String premiumCredit) {
        this.premiumCredit = premiumCredit;
    }

    public Float getTotalAnnualPremiumWithDiscount() {
        return totalAnnualPremiumWithDiscount;
    }

    public void setTotalAnnualPremiumWithDiscount(Float totalAnnualPremiumWithDiscount) {
        this.totalAnnualPremiumWithDiscount = totalAnnualPremiumWithDiscount;
    }

    public ClientRateBankDto getMedicalQuote() {
        return medicalQuote;
    }

    public void setMedicalQuote(ClientRateBankDto medicalQuote) {
        this.medicalQuote = medicalQuote;
    }

    public ClientRateBankDto getKaiserQuote() {
        return kaiserQuote;
    }

    public void setKaiserQuote(ClientRateBankDto kaiserQuote) {
        this.kaiserQuote = kaiserQuote;
    }

    public ClientRateBankDto getDentalQuote() {
        return dentalQuote;
    }

    public void setDentalQuote(ClientRateBankDto dentalQuote) {
        this.dentalQuote = dentalQuote;
    }

    public ClientRateBankDto getVisionQuote() {
        return visionQuote;
    }

    public void setVisionQuote(ClientRateBankDto visionQuote) {
        this.visionQuote = visionQuote;
    }

    public Float getProjectedBundleDiscountPercent() {
        return projectedBundleDiscountPercent;
    }

    public void setProjectedBundleDiscountPercent(Float projectedBundleDiscountPercent) {
        this.projectedBundleDiscountPercent = projectedBundleDiscountPercent;
    }

    public Boolean getDentalDiscount() {
        return dentalDiscount;
    }

    public void setDentalDiscount(Boolean dentalDiscount) {
        this.dentalDiscount = dentalDiscount;
    }

    public Boolean getVisionDiscount() {
        return visionDiscount;
    }

    public void setVisionDiscount(Boolean visionDiscount) {
        this.visionDiscount = visionDiscount;
    }

    public Boolean getLifeDiscount() {
        return lifeDiscount;
    }

    public void setLifeDiscount(Boolean lifeDiscount) {
        this.lifeDiscount = lifeDiscount;
    }

    public Boolean getStdDiscount() {
        return stdDiscount;
    }

    public void setStdDiscount(Boolean stdDiscount) {
        this.stdDiscount = stdDiscount;
    }

    public Boolean getLtdDiscount() {
        return ltdDiscount;
    }

    public void setLtdDiscount(Boolean ltdDiscount) {
        this.ltdDiscount = ltdDiscount;
    }

    public List<ClientMemberDto> getClientMembers() {
        return clientMembers;
    }

    public void setClientMembers(List<ClientMemberDto> clientMembers) {
        this.clientMembers = clientMembers;
    }
    
    
}

