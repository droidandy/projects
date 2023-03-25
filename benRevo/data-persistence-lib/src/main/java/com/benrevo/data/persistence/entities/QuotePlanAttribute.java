package com.benrevo.data.persistence.entities;

import javax.persistence.*;

import com.benrevo.common.enums.QuotePlanAttributeName;
import org.springframework.beans.BeanUtils;

@Entity
@DiscriminatorValue("QUOTE_PLAN")
public class QuotePlanAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private RfpQuoteNetworkPlan plan;
    
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    private QuotePlanAttributeName name;

    @Column(name = "value")
    private String value;
    
    public QuotePlanAttribute() {
    }

    public QuotePlanAttribute(RfpQuoteNetworkPlan plan, QuotePlanAttributeName name, String value) {
        this.plan = plan;
        this.name = name;
        this.value = value;
    }
    
	public QuotePlanAttribute(QuotePlanAttributeName name, String value) {
		this.name = name;
		this.value = value;
	}

	public RfpQuoteNetworkPlan getPlan() {
		return plan;
	}

	public void setPlan(RfpQuoteNetworkPlan plan) {
		this.plan = plan;
	}

	public QuotePlanAttributeName getName() {
		return name;
	}

	public void setName(QuotePlanAttributeName name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

    public QuotePlanAttribute copy() {
        QuotePlanAttribute copy = new QuotePlanAttribute();
        BeanUtils.copyProperties(this, copy, "attributeId");
        return copy;
    }
    
}
