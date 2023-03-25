package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by ebrandell on 4/16/18 at 2:20 PM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanInfoDto {

    private Long planId;
    private String planName;
    private String planType;
    private Integer planYear;

    private List<BenefitDto> planBenefits;
    private NetworkDto planNetwork;

    private Date pnnCreated;
    private Date pnnUpdated;

    private Date planCreated;
    private Date planUpdated;

    public PlanInfoDto() {}

    private PlanInfoDto(Builder builder) {
        setPlanId(builder.planId);
        setPlanName(builder.planName);
        setPlanType(builder.planType);
        setPlanYear(builder.planYear);
        setPlanBenefits(builder.planBenefits);
        setPlanNetwork(builder.planNetwork);
        setPnnCreated(builder.pnnCreated);
        setPnnUpdated(builder.pnnUpdated);
        setPlanCreated(builder.planCreated);
        setPlanUpdated(builder.planUpdated);
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Integer getPlanYear() {
        return planYear;
    }

    public void setPlanYear(Integer planYear) {
        this.planYear = planYear;
    }

    public List<BenefitDto> getPlanBenefits() {
        return planBenefits;
    }

    public void setPlanBenefits(List<BenefitDto> planBenefits) {
        this.planBenefits = planBenefits;
    }

    public NetworkDto getPlanNetwork() {
        return planNetwork;
    }

    public void setPlanNetwork(NetworkDto planNetwork) {
        this.planNetwork = planNetwork;
    }

    public Date getPnnCreated() {
        return pnnCreated;
    }

    public void setPnnCreated(Date pnnCreated) {
        this.pnnCreated = pnnCreated;
    }

    public Date getPnnUpdated() {
        return pnnUpdated;
    }

    public void setPnnUpdated(Date pnnUpdated) {
        this.pnnUpdated = pnnUpdated;
    }

    public Date getPlanCreated() {
        return planCreated;
    }

    public void setPlanCreated(Date planCreated) {
        this.planCreated = planCreated;
    }

    public Date getPlanUpdated() {
        return planUpdated;
    }

    public void setPlanUpdated(Date planUpdated) {
        this.planUpdated = planUpdated;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;

        PlanInfoDto that = (PlanInfoDto) o;

        return Objects.equals(this.planBenefits, that.planBenefits) &&
               Objects.equals(this.planCreated, that.planCreated) &&
               Objects.equals(this.planId, that.planId) &&
               Objects.equals(this.planName, that.planName) &&
               Objects.equals(this.planNetwork, that.planNetwork) &&
               Objects.equals(this.planType, that.planType) &&
               Objects.equals(this.planUpdated, that.planUpdated) &&
               Objects.equals(this.planYear, that.planYear) &&
               Objects.equals(this.pnnCreated, that.pnnCreated) &&
               Objects.equals(this.pnnUpdated, that.pnnUpdated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(planBenefits, planCreated, planId, planName, planNetwork, planType,
                            planUpdated, planYear, pnnCreated, pnnUpdated
        );
    }

    public static final class Builder {

        private Long planId;
        private String planName;
        private String planType;
        private Integer planYear;
        private List<BenefitDto> planBenefits;
        private NetworkDto planNetwork;
        private Date pnnCreated;
        private Date pnnUpdated;
        private Date planCreated;
        private Date planUpdated;

        public Builder() {}

        public Builder withPlanId(Long val) {
            planId = val;
            return this;
        }

        public Builder withPlanName(String val) {
            planName = val;
            return this;
        }

        public Builder withPlanType(String val) {
            planType = val;
            return this;
        }

        public Builder withPlanYear(Integer val) {
            planYear = val;
            return this;
        }

        public Builder withPlanBenefits(List<BenefitDto> val) {
            planBenefits = val;
            return this;
        }

        public Builder withPlanNetwork(NetworkDto val) {
            planNetwork = val;
            return this;
        }

        public Builder withPnnCreated(Date val) {
            pnnCreated = val;
            return this;
        }

        public Builder withPnnUpdated(Date val) {
            pnnUpdated = val;
            return this;
        }

        public Builder withPlanCreated(Date val) {
            planCreated = val;
            return this;
        }

        public Builder withPlanUpdated(Date val) {
            planUpdated = val;
            return this;
        }

        public PlanInfoDto build() {
            return new PlanInfoDto(this);
        }
    }
}
