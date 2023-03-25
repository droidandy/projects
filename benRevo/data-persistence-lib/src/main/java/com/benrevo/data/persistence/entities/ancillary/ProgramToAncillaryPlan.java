package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "program_to_ancillary_plan")
public class ProgramToAncillaryPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_to_ancillary_plan_id")
    private Long programToAncillaryPlanId;
    
    @Column(name = "program_id")
    private Long programId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ancillary_plan_id")
    private AncillaryPlan ancillaryPlan;
 
    public ProgramToAncillaryPlan() {}
    
    public Long getProgramId() {
        return programId;
    }
    
    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getProgramToAncillaryPlanId() {
		return programToAncillaryPlanId;
	}

	public void setProgramToAncillaryPlanId(Long programToAncillaryPlanId) {
		this.programToAncillaryPlanId = programToAncillaryPlanId;
	}

	public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }
    
    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    }
}
