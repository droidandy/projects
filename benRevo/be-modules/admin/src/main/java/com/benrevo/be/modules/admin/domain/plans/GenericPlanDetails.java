package com.benrevo.be.modules.admin.domain.plans;

import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;

import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Network;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;


public class GenericPlanDetails {

	private Map<String, Network> planNamesByNetwork = new HashMap<>();
	private Map<String, String> benefitKeysAdded = new HashMap<>();
	private List<Benefit> benefits = new ArrayList<>();
	
	public String getCalculatedName() {
		StringBuffer sb = new StringBuffer();
		int counter = 0;
		for (String s : planNamesByNetwork.keySet()) {
			if(counter > 0) {
				sb.append("|");
			}
			sb.append(s);
			counter++;
		}
		return sb.toString();
	}

	public Map<String, String> getBenefitKeysAdded() {
		return benefitKeysAdded;
	}

	public Map<String, Network> getPlanNamesByNetwork() {
		return planNamesByNetwork;
	}
	
	public void addIfValidPlanNameByNetwork(Network network, String planNameByNetwork) {
		if (planNameByNetwork != null && planNameByNetwork.length() > 0 && !planNameByNetwork.equalsIgnoreCase("N/A")) {

			//clean up plan name, remove all duplicate and extra space
			planNameByNetwork = getStandardAnthemPlanName(planNameByNetwork);

			//System.out.println("Plan name:|"+ planNameByNetwork +"|");
			Network oldNetwork = planNamesByNetwork.put(planNameByNetwork, network);
			if (oldNetwork != null) {
			    // pnn with this name was already added
			    throw new IllegalArgumentException("Dublicate planNameByNetwork name: " + planNameByNetwork);
			}
		} else {
			//TODO: Throw error, and rework if block to ignore N/A
		}
	}

	public List<Benefit> getBenefits() {
		return benefits;
	}
	
	public void addBenefit(List<BenefitName> benefitNames, String benName, String inOut, String value) throws IllegalArgumentException {
		BenefitName benefitName = lookupBenefitName(benefitNames, benName);
		if (benefitName == null) {
			throw new IllegalArgumentException("Invalid benefitName passed: " + benName);
		}

		//create benefit that belongs to this plan
		Benefit newBenefit = new Benefit();
		newBenefit.setBenefitName(benefitName);
		newBenefit.setInOutNetwork(inOut);
		newBenefit.setValue(value);
		//newBenefit.setRestriction(restriction);

		benefits.add(newBenefit);
		benefitKeysAdded.put(benName, value);
	}

	public Network getNetworkForPlanName(String planName){
		return this.planNamesByNetwork.get(planName);
	}

	public Set<String> getPlanNames() {
		return planNamesByNetwork.keySet();
	}

	private BenefitName lookupBenefitName(List<BenefitName> benefitNames, String benName) throws IllegalArgumentException {
		for (BenefitName bn : benefitNames) {
			if (bn.getName().equals(benName))
				return bn;
		}

		throw new IllegalArgumentException("Benefit with name: " + benName + " was not found in list of allowed benefits. Aborting.");
	}
}
