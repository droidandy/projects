package com.benrevo.common.params;

import java.util.ArrayList;

public class PlanSearchParams {

    private long id;
    private long bucket;
    private String tier = "TIER_1_FULL";
    private ArrayList<BenefitSearchParams> search;

    public ArrayList<BenefitSearchParams> getBenefitSearchParams() {
        return search;
    }

    public void setBenefitSearchParams(ArrayList<BenefitSearchParams> search) {
        this.search = search;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getBucket() {
        return bucket;
    }

    public void setBucket(long bucket) {
        this.bucket = bucket;
    }

    public ArrayList<BenefitSearchParams> getSearch() {
        return search;
    }

    public void setSearch(ArrayList<BenefitSearchParams> search) {
        this.search = search;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }
}
