package com.benrevo.common.dto;

import java.util.ArrayList;

public class RenewalOptionDetails {

    private int id;
    private String name;
    private ArrayList<RenewalAltBucketCost> planType;
    private CensusDto census;

    public RenewalOptionDetails() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<RenewalAltBucketCost> getPlanType() {
        return planType;
    }

    public void setPlanType(ArrayList<RenewalAltBucketCost> planType) {
        this.planType = planType;
    }

    public CensusDto getCensus() {
        return census;
    }

    public void setCensus(CensusDto census) {
        this.census = census;
    }
}
