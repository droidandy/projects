package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PlanCost {

    private int id;
    private String name;
    private String planType;
    private Contributions cost;
    private int selected;
    @JsonProperty("bucket_id")
    private int bucketId;
    @JsonProperty("final_selected")
    private boolean finalSelected;

    public PlanCost() {
    }

    public PlanCost(int id, String name, Contributions cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
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

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Contributions getCost() {
        return cost;
    }

    public void setCost(Contributions cost) {
        this.cost = cost;
    }

    public int getSelected() {
        return selected;
    }

    public void setSelected(int selected) {
        this.selected = selected;
    }

    public int getBucketId() {
        return bucketId;
    }

    public void setBucketId(int bucketId) {
        this.bucketId = bucketId;
    }

    public boolean isFinalSelected() {
        return finalSelected;
    }

    public void setFinalSelected(boolean finalSelected) {
        this.finalSelected = finalSelected;
    }
}
