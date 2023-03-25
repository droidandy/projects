package com.benrevo.common.dto.deprecated;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AltBucketDto {

    private long id;
    private long clientId;
    private String category;
    private String planType;
    private String name;
    private long contributionTier1;
    private long contributionTier2;
    private long contributionTier3;
    private long contributionTier4;
    private Timestamp visited;
    @JsonProperty("custom_plan_name")
    private String customName;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getContributionTier1() {
        return contributionTier1;
    }

    public void setContributionTier1(long contributionTier1) {
        this.contributionTier1 = contributionTier1;
    }

    public long getContributionTier2() {
        return contributionTier2;
    }

    public void setContributionTier2(long contributionTier2) {
        this.contributionTier2 = contributionTier2;
    }

    public long getContributionTier3() {
        return contributionTier3;
    }

    public void setContributionTier3(long contributionTier3) {
        this.contributionTier3 = contributionTier3;
    }

    public long getContributionTier4() {
        return contributionTier4;
    }

    public void setContributionTier4(long contributionTier4) {
        this.contributionTier4 = contributionTier4;
    }

    public Timestamp getVisited() {
        return visited;
    }

    public void setVisited(Timestamp visited) {
        this.visited = visited;
    }

    public long getClientId() {
        return clientId;
    }

    public void setClientId(long clientId) {
        this.clientId = clientId;
    }

    public String getCustomName() {
        return customName;
    }

    public void setCustomName(String customName) {
        this.customName = customName;
    }
}
