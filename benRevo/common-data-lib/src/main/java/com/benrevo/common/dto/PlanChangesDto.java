package com.benrevo.common.dto;

public class PlanChangesDto {

    private String networkName;

    private String planName;

    private Float[] currentRates;

    private Float[] newRates;

    public PlanChangesDto() {
    }

    public PlanChangesDto(String networkName, String planName, Float[] oldRates, Float[] newRates) {
        this.networkName = networkName;
        this.planName = planName;
        this.currentRates = oldRates;
        this.newRates = newRates;
    }

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public Float[] getCurrentRates() {
        return currentRates;
    }

    public void setCurrentRates(Float[] currentRates) {
        this.currentRates = currentRates;
    }

    public Float[] getNewRates() {
        return newRates;
    }

    public void setNewRates(Float[] newRates) {
        this.newRates = newRates;
    }
}
