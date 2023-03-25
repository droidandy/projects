package com.benrevo.common.dto;

import com.benrevo.common.dto.PlanCost;
import com.benrevo.common.dto.deprecated.AltBucketDto;

import java.util.List;

public class RenewalAltBucketCost {
	
	private String name;
	private PlanCost current;
	private PlanCost initial;
	private PlanCost negotiated;
	private List<PlanCost> options;
	private AltBucketDto contribution;
	
	public RenewalAltBucketCost() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PlanCost getCurrent() {
		return current;
	}

	public void setCurrent(PlanCost current) {
		this.current = current;
	}

	public PlanCost getInitial() {
		return initial;
	}

	public void setInitial(PlanCost initial) {
		this.initial = initial;
	}

	public PlanCost getNegotiated() {
		return negotiated;
	}

	public void setNegotiated(PlanCost negotiated) {
		this.negotiated = negotiated;
	}

	public List<PlanCost> getOptions() {
		return options;
	}

	public void setOptions(List<PlanCost> options) {
		this.options = options;
	}

	public AltBucketDto getContribution() {
		return contribution;
	}

	public void setContribution(AltBucketDto contribution) {
		this.contribution = contribution;
	}
}
