package com.benrevo.data.persistence.entities.ancillary;

import com.benrevo.data.persistence.entities.RFP;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "rfp_to_ancillary_plan")
public class RfpToAncillaryPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rfp_id", referencedColumnName = "rfp_id", nullable = false)
    private RFP rfp;

    @ManyToOne
    @JoinColumn(name = "ancillary_plan_id", referencedColumnName = "ancillary_plan_id", nullable = false)
    private AncillaryPlan ancillaryPlan;

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

    public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }

    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    }

    public RfpToAncillaryPlan copy() {
        RfpToAncillaryPlan copy = new RfpToAncillaryPlan();
        BeanUtils.copyProperties(this, copy, "id", "rfp", "ancillaryPlan");
        return copy;
    }
}
