package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class CarrierPlansPreviewDto {

	public static class ChangedPlan {
		public String networkName;
		public String planType;
		public String planName;
		public List<ChangedBenefit> changedBenefits;
		
		public ChangedPlan() {}
		
		public ChangedPlan(String networkName, String planType, String planName) {
			this.networkName = networkName;
			this.planType = planType;
			this.planName = planName;
		}
	}

	public static class ChangedBenefit {
		public String name;
		public String oldValue;
		public String newValue;
		
		public ChangedBenefit() {}
		
		public ChangedBenefit(String name, String oldValue, String newValue) {
			this.name = name;
			this.oldValue = oldValue;
			this.newValue = newValue;
		}
	}

	private List<ChangedPlan> updated = new ArrayList<>();
	private List<ChangedPlan> added = new ArrayList<>();
	private List<ChangedPlan> removed = new ArrayList<>();

	public CarrierPlansPreviewDto() {
	}

	public List<ChangedPlan> getUpdated() {
		return updated;
	}

	public void setUpdated(List<ChangedPlan> updated) {
		this.updated = updated;
	}

	public List<ChangedPlan> getAdded() {
		return added;
	}

	public void setAdded(List<ChangedPlan> added) {
		this.added = added;
	}

	public List<ChangedPlan> getRemoved() {
		return removed;
	}

	public void setRemoved(List<ChangedPlan> removed) {
		this.removed = removed;
	}
}
