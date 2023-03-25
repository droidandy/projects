package com.benrevo.data.persistence.entities.ancillary;

import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Entity
@Table(name = "ancillary_class")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AncillaryClass {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ancillary_class_id")
    private Long ancillaryClassId;

    @Column(name = "name")
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ancillary_plan_id", referencedColumnName = "ancillary_plan_id", nullable = false)
    private AncillaryPlan ancillaryPlan;
    
    public AncillaryClass() {
	}

	public AncillaryClass copy() {
	    AncillaryClass copy = newInstance();
		BeanUtils.copyProperties(this, copy, "ancillaryClassId");
		return copy;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		return new org.apache.commons.lang3.builder.EqualsBuilder()
				.reflectionAppend(this, obj)
				.setExcludeFields("ancillaryPlan")
				.isEquals();
	}

    public abstract AncillaryClass newInstance();
	
    public Long getAncillaryClassId() {
        return ancillaryClassId;
    }
    
    public void setAncillaryClassId(Long ancillaryClassId) {
        this.ancillaryClassId = ancillaryClassId;
    }

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
 
    public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }

    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    }
}