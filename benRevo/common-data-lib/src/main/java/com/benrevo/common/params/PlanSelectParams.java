package com.benrevo.common.params;

import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlanSelectParams {
	
	private int bucket;
	private ArrayList<Integer> planIds;
	@JsonProperty("plan_id")
	private int planId;

	public int getBucket() {
		return bucket;
	}

	public void setBucket(int bucket) {
		this.bucket = bucket;
	}

	public ArrayList<Integer> getPlanIds() {
		return planIds;
	}
	
	public void setPlanIds(ArrayList<Integer> planIds) {
		this.planIds = planIds;
	}

	public int getPlanId() {
		return planId;
	}

	public void setPlanId(int planId) {
		this.planId = planId;
	}
}
