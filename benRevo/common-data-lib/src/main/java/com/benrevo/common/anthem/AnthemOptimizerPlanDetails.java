package com.benrevo.common.anthem;

public class AnthemOptimizerPlanDetails {

    private String planType;
    private String planName;
    private String carrierName;

    //Enrollment or Census Section
    private Long tier1Census=0L;
    private Long tier2Census=0L;
    private Long tier3Census=0L;
    private Long tier4Census=0L;

    // Rates
    private Float tier1Rate=0F;
    private Float tier2Rate=0F;
    private Float tier3Rate=0F;
    private Float tier4Rate=0F;

    // Contributions
    private Float tier1ErContribution=0F;
    private Float tier2ErContribution=0F;
    private Float tier3ErContribution=0F;
    private Float tier4ErContribution=0F;

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }


    public Long getTier1Census() {
        return tier1Census;
    }

    public void setTier1Census(Long tier1Census) {
        this.tier1Census = tier1Census;
    }

    public Long getTier2Census() {
        return tier2Census;
    }

    public void setTier2Census(Long tier2Census) {
        this.tier2Census = tier2Census;
    }

    public Long getTier3Census() {
        return tier3Census;
    }

    public void setTier3Census(Long tier3Census) {
        this.tier3Census = tier3Census;
    }

    public Long getTier4Census() {
        return tier4Census;
    }

    public void setTier4Census(Long tier4Census) {
        this.tier4Census = tier4Census;
    }

    public Float getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(Float tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public Float getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(Float tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public Float getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(Float tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public Float getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(Float tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public Float getTier1ErContribution() {
        return tier1ErContribution;
    }

    public void setTier1ErContribution(Float tier1ErContribution) {
        this.tier1ErContribution = tier1ErContribution;
    }

    public Float getTier2ErContribution() {
        return tier2ErContribution;
    }

    public void setTier2ErContribution(Float tier2ErContribution) {
        this.tier2ErContribution = tier2ErContribution;
    }

    public Float getTier3ErContribution() {
        return tier3ErContribution;
    }

    public void setTier3ErContribution(Float tier3ErContribution) {
        this.tier3ErContribution = tier3ErContribution;
    }

    public Float getTier4ErContribution() {
        return tier4ErContribution;
    }

    public void setTier4ErContribution(Float tier4ErContribution) {
        this.tier4ErContribution = tier4ErContribution;
    }

    @Override
    public String toString() {
        return "AnthemOptimizerPlanDetails [planType=" + planType + ", planName=" + planName
            + ", carrierName=" + carrierName + ", tier1Census=" + tier1Census + ", tier2Census=" + tier2Census
            + ", tier3Census=" + tier3Census + ", tier4Census=" + tier4Census + ", tier1Rate=" + tier1Rate
            + ", tier2Rate=" + tier2Rate + ", tier3Rate=" + tier3Rate + ", tier4Rate=" + tier4Rate
            + ", tier1ErContribution=" + tier1ErContribution + ", tier2ErContribution=" + tier2ErContribution
            + ", tier3ErContribution=" + tier3ErContribution + ", tier4ErContribution=" + tier4ErContribution
            + "]";
    }
}
