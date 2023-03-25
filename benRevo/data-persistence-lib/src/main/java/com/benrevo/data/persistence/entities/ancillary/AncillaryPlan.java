package com.benrevo.data.persistence.entities.ancillary;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import org.springframework.beans.BeanUtils;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.Carrier;

@Entity
@Table(name = "ancillary_plan")
public class AncillaryPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ancillary_plan_id")
    private Long ancillaryPlanId;
    
	@Enumerated(EnumType.STRING)
    @Column(name = "plan_type")
	private AncillaryPlanType planType; 

	@Column(name = "plan_year")
	private int planYear;
	
	@Column(name = "plan_name")
	private String planName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "carrier_id", referencedColumnName = "carrier_id", nullable = false)
	private Carrier carrier;
    
	@OneToMany(mappedBy = "ancillaryPlan",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<AncillaryClass> classes;
	
	@OneToOne(mappedBy = "ancillaryPlan",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private AncillaryRate rates;

	public AncillaryPlan() {
	}

    public Long getAncillaryPlanId() {
        return ancillaryPlanId;
    }

    public void setAncillaryPlanId(Long ancillaryPlanId) {
        this.ancillaryPlanId = ancillaryPlanId;
    }

    public AncillaryPlanType getPlanType() {
		return planType;
	}

	public void setPlanType(AncillaryPlanType planType) {
		this.planType = planType;
	}

	public List<AncillaryClass> getClasses() {
		return classes;
	}

	public void setClasses(List<AncillaryClass> classes) {
		this.classes = classes;
	}

	public AncillaryRate getRates() {
		return rates;
	}

	public void setRates(AncillaryRate rates) {
		this.rates = rates;
	}

	public int getPlanYear() {
		return planYear;
	}

	public void setPlanYear(int planYear) {
		this.planYear = planYear;
	}

    public Carrier getCarrier() {
        return carrier;
    }
    
    public void setCarrier(Carrier carrier) {
        this.carrier = carrier;
    }
    
    public String getPlanName() {
        return planName;
    }
    
    public void setPlanName(String planName) {
        this.planName = planName;
    }
    
    @Transient
    public PlanCategory getProduct() {
    	if(planType == null || classes == null || classes.isEmpty()) {
    		return null;
    	}
    	String product = null;
    	for (AncillaryClass cl : classes) {
			String classType = null;
    		if (cl instanceof LifeClass) {
    			classType = Constants.LIFE;
			} else if (cl instanceof StdClass) {
				classType = Constants.STD;
			} else if (cl instanceof LtdClass) {
				classType = Constants.LTD;
			}
    		// unsupported class type or different classes in the plan (incorrect plan)
    		if (classType == null || (product != null && !classType.equals(product))) { 
    			throw new IllegalArgumentException("Incorrect plan classes. Cannot determinate product");
    		}
    		product = classType;
		}
    	if (planType == AncillaryPlanType.VOLUNTARY) {
    		product = "VOL_" + product;
    	}
    	return PlanCategory.valueOf(product);
    }

    @Override
	public int hashCode() {
		return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
				.append(getAncillaryPlanId())
				.append(getPlanType())
				.append(planYear)
				.append(carrier)
				.append(planName)
				.toHashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		AncillaryPlan other = (AncillaryPlan) obj;
		
		return new org.apache.commons.lang3.builder.EqualsBuilder()
			.append(getAncillaryPlanId(), other.getAncillaryPlanId())
			.append(getPlanType(), other.getPlanType())
			.append(planYear, other.getPlanYear())
			.append(carrier, other.getCarrier())
			.append(planName, other.getPlanName())
			.isEquals();
	}
	
    public AncillaryPlan copy() {
        AncillaryPlan copy = new AncillaryPlan();
      BeanUtils.copyProperties(this, copy, "ancillaryPlanId");
      if (classes != null) {
        copy.setClasses(new ArrayList<>());
        for (AncillaryClass clazz : classes) {
          AncillaryClass classCopy = clazz.copy();
          classCopy.setAncillaryPlan(copy);
          copy.getClasses().add(classCopy);
        }
      }
      if (rates != null) {
          AncillaryRate ratesCopy = rates.copy();
          ratesCopy.setAncillaryPlan(copy);
          copy.setRates(ratesCopy);
      }
      return copy;
    }
}