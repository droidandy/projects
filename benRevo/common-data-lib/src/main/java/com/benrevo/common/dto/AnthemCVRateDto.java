package com.benrevo.common.dto;

import java.util.Date;

public class AnthemCVRateDto {
    private Integer ratingTiers;
    private String sicCode;
    private String predominantCounty;
    private String effectiveDate;
    private Float averageAge;
    private String paymentMethod;
    private String commission;

    private String dentalPaymentMethod;
    private String dentalCommission;

    private boolean turnOnMedical1Percent;

    public Integer getRatingTiers() {
        return ratingTiers;
    }

    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }

    public String getSicCode() {
        return sicCode;
    }

    public void setSicCode(String sicCode) {
        this.sicCode = sicCode;
    }

    public String getPredominantCounty() {
        return predominantCounty;
    }

    public void setPredominantCounty(String predominantCounty) {
        this.predominantCounty = predominantCounty;
    }

    public String getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(String effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Float getAverageAge() {
        return averageAge;
    }

    public void setAverageAge(Float averageAge) {
        this.averageAge = averageAge;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCommission() {
        return commission;
    }

    public void setCommission(String commission) {
        this.commission = commission;
    }

    public boolean isTurnOnMedical1Percent() {
        return turnOnMedical1Percent;
    }

    public void setTurnOnMedical1Percent(boolean turnOnMedical1Percent) {
        this.turnOnMedical1Percent = turnOnMedical1Percent;
    }

    public String getDentalPaymentMethod() {
        return dentalPaymentMethod;
    }

    public void setDentalPaymentMethod(String dentalPaymentMethod) {
        this.dentalPaymentMethod = dentalPaymentMethod;
    }

    public String getDentalCommission() {
        return dentalCommission;
    }

    public void setDentalCommission(String dentalCommission) {
        this.dentalCommission = dentalCommission;
    }
}