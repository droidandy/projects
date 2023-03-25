package com.benrevo.common.dto;

public class AnthemCVDentalRates {
    private Float[] highRates;

    private Float[] mediumRates;

    private Float[] lowRates;


    public Float[] getHighRates() {
        return highRates;
    }

    public void setHighRates(Float[] highRates) {
        this.highRates = highRates;
    }

    public Float[] getMediumRates() {
        return mediumRates;
    }

    public void setMediumRates(Float[] mediumRates) {
        this.mediumRates = mediumRates;
    }

    public Float[] getLowRates() {
        return lowRates;
    }

    public void setLowRates(Float[] lowRates) {
        this.lowRates = lowRates;
    }
}
