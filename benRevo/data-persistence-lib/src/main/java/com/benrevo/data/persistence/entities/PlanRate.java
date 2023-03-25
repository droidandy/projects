package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.PlanRateType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "plan_rate")
public class PlanRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_rate_id")
    private Long planRateId;
    
    @Column(name = "program_to_pnn_id")
    private Long programToPnnId;
    
    @Column(name = "rating_tiers")
    private Integer ratingTiers; // number between 1-4 like in RFP
    
    @Column(name = "rating_band")
    private Float ratingBand; // number between 0-9 (.5 increments) 
    
    @Column(name = "`type`")
    @Enumerated(EnumType.STRING)
    private PlanRateType type;
    
    @Column(name = "type_value")
    private String typeValue;
    
    @Column(name = "type_2")
    @Enumerated(EnumType.STRING)
    private PlanRateType type2;
    
    @Column(name = "type_value_2")
    private String typeValue2;
    
    @Column(name = "type_3")
    @Enumerated(EnumType.STRING)
    private PlanRateType type3;
    
    @Column(name = "type_value_3")
    private String typeValue3;
    
    @Column(name = "tier1_rate")
    private Float tier1Rate;
    
    @Column(name = "tier2_rate")
    private Float tier2Rate;
    
    @Column(name = "tier3_rate")
    private Float tier3Rate;
    
    @Column(name = "tier4_rate")
    private Float tier4Rate;
    
    public PlanRate() {}
    
    public Long getPlanRateId() {
        return planRateId;
    }
    
    public void setPlanRateId(Long planRateId) {
        this.planRateId = planRateId;
    }
    
    public Long getProgramToPnnId() {
        return programToPnnId;
    }
    
    public void setProgramToPnnId(Long programToPnnId) {
        this.programToPnnId = programToPnnId;
    }
    
    public Integer getRatingTiers() {
        return ratingTiers;
    }
    
    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }

    public Float getRatingBand() {
        return ratingBand;
    }

    public void setRatingBand(Float ratingBand) {
        this.ratingBand = ratingBand;
    }

    public PlanRateType getType() {
        return type;
    }
    
    public void setType(PlanRateType type) {
        this.type = type;
    }
    
    public String getTypeValue() {
        return typeValue;
    }
    
    public void setTypeValue(String typeValue) {
        this.typeValue = typeValue;
    }
    
    public PlanRateType getType2() {
        return type2;
    }
    
    public void setType2(PlanRateType type2) {
        this.type2 = type2;
    }
    
    public String getTypeValue2() {
        return typeValue2;
    }
    
    public void setTypeValue2(String typeValue2) {
        this.typeValue2 = typeValue2;
    }
    
    public PlanRateType getType3() {
        return type3;
    }
    
    public void setType3(PlanRateType type3) {
        this.type3 = type3;
    }
    
    public String getTypeValue3() {
        return typeValue3;
    }
    
    public void setTypeValue3(String typeValue3) {
        this.typeValue3 = typeValue3;
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

    public PlanRate copy() {
        PlanRate copy = new PlanRate();
        BeanUtils.copyProperties(this, copy, "planRateId");
        return copy;
    }
}
