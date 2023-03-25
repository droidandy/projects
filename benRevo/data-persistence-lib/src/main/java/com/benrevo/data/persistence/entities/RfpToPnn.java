package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "rfp_to_pnn")
public class RfpToPnn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "rfp_id", nullable = false)
    private RFP rfp;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pnn_id", nullable = false)
    private PlanNameByNetwork pnn;

    @Column(name = "plan_type")
    private String planType;

    @Column(name = "option_id")
    private Long optionId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RFP getRfp() {
        return rfp;
    }

    public void setRfp(RFP rfp) {
        this.rfp = rfp;
    }

    public PlanNameByNetwork getPnn() {
        return pnn;
    }

    public void setPnn(PlanNameByNetwork pnn) {
        this.pnn = pnn;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public RfpToPnn copy() {
        RfpToPnn copy = new RfpToPnn();
        BeanUtils.copyProperties(this, copy, "id", "rfp", "pnn");
        return copy;
    }
}
