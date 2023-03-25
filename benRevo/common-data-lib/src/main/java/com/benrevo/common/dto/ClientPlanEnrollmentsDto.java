package com.benrevo.common.dto;


import static com.benrevo.common.Constants.TIER1_PLAN_NAME;
import static com.benrevo.common.Constants.TIER2_PLAN_NAME;
import static com.benrevo.common.Constants.TIER3_PLAN_NAME;
import static com.benrevo.common.Constants.TIER4_PLAN_NAME;

import java.util.ArrayList;
import java.util.List;

import javax.xml.ws.Holder;

public class ClientPlanEnrollmentsDto {

	public static class Network {
		public Long clientPlanId;
		public String type;
		public String planName;
		public Network() {}
		public Network(Long clientPlanId, String type, String planName) {
			this.clientPlanId = clientPlanId;
			this.type = type;
			this.planName = planName;
		}
	}

	public static class Contribution {
		public List<Holder<Long>> values = new ArrayList<>();
		public String planName;
		public Contribution() {}
		public Contribution(String planName) {
			this.planName = planName;
		}
	}
	
	public static class Enrollment {
		private final List<Network> networks = new ArrayList<>();
		private final List<Contribution> contributions = new ArrayList<>(4);
		private final List<Holder<Long>> total = new ArrayList<>();

		public Enrollment() {
			contributions.add(new Contribution(TIER1_PLAN_NAME));
			contributions.add(new Contribution(TIER2_PLAN_NAME));
			contributions.add(new Contribution(TIER3_PLAN_NAME));
			contributions.add(new Contribution(TIER4_PLAN_NAME));
		}

		public void addPlanEnrollment(Long planId, String planType, String planName, Long tier1Value, Long tier2Value, Long tier3Value, Long tier4Value) {
			networks.add(new Network(planId, planType, planName));
			contributions.get(0).values.add(new Holder(tier1Value));
			contributions.get(1).values.add(new Holder(tier2Value));
			contributions.get(2).values.add(new Holder(tier3Value));
			contributions.get(3).values.add(new Holder(tier4Value));	
			long totalValue = 0;
			int currectIndex = networks.size() - 1;
			for (Contribution contribution : contributions) {
				totalValue += contribution.values.get(currectIndex).value;
			}
			total.add(new Holder(totalValue));
		}

		public List<Holder<Long>> getTotal() {
			return total;
		}

		public List<Network> getNetworks() {
			return networks;
		}

		public List<Contribution> getContributions() {
			return contributions;
		}
	}
	
	private Enrollment medical;
	private Enrollment dental;
	private Enrollment vision;
	
	public ClientPlanEnrollmentsDto() {
	}

	public Enrollment getMedical() {
		return medical;
	}

	public void setMedical(Enrollment medical) {
		this.medical = medical;
	}

	public Enrollment getDental() {
		return dental;
	}

	public void setDental(Enrollment dental) {
		this.dental = dental;
	}

	public Enrollment getVision() {
		return vision;
	}

	public void setVision(Enrollment vision) {
		this.vision = vision;
	}
}
