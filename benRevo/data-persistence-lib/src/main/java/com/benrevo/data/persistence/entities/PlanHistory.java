package com.benrevo.data.persistence.entities;

import com.benrevo.data.persistence.converter.type.StringType;
import javax.persistence.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;

@Entity
@Table(name = "plan_history")
public class PlanHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "pnn_id")
    private Long pnnId;

    @Column(name = "plan_name")
    @Convert(converter = StringType.class)
    private String planName;

    @Column(name = "benefit_from")
    private String benefitFrom;

    @Column(name = "benefit_to")
    private String benefitTo;

    @Column(name = "batch_number")
    private Long batchNumber;

    public PlanHistory() {
    }

    public PlanHistory(Long pnnId, String planName, String benefitFrom, String benefitTo, Long batchNumber) {
        this.pnnId = pnnId;
        this.planName = planName;
        this.benefitFrom = benefitFrom;
        this.benefitTo = benefitTo;
        this.batchNumber = batchNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPnnId() {
        return pnnId;
    }

    public void setPnnId(Long pnnId) {
        this.pnnId = pnnId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getBenefitFrom() {
        return benefitFrom;
    }

    public void setBenefitFrom(String benefitFrom) {
        this.benefitFrom = benefitFrom;
    }

    public String getBenefitTo() {
        return benefitTo;
    }

    public void setBenefitTo(String benefitTo) {
        this.benefitTo = benefitTo;
    }

    public Long getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(Long batchNumber) {
        this.batchNumber = batchNumber;
    }
}