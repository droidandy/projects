package com.benrevo.admin.domain.plans.UHC;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * @deprecated  There is a generic plan loader in com.benrevo.data.loaders.coreapplication.plan that will be used
 * 				to load plans from all carriers
 * 				DO NOT REMOVE YET
 */
@Deprecated
public class PlanDetails {

	private static final Logger LOGGER = LogManager.getLogger(PlanDetails.class);
	private Map<Long, String> planNamesByNetwork = new HashMap<Long, String>();
	private List<Benefit> benefits = new ArrayList<Benefit>();
	
	public String getCalculatedName() {
		StringBuffer sb = new StringBuffer();
		for (String s : planNamesByNetwork.values()) {
			sb.append(s+"|");
		}
		return sb.toString();
	}

	public Map<Long, String> getPlanNamesByNetwork() {
		return planNamesByNetwork;
	}
	
	public void addPlanNameByNetwork(Long networkId, String planNameByNetwork) {
		if (planNameByNetwork != null && planNameByNetwork.length() > 0 && !planNameByNetwork.equals("N/A")) {
			planNamesByNetwork.put(networkId, planNameByNetwork);
		}
	}

	public List<Benefit> getBenefits() {
		return benefits;
	}
	
	public void addBenefit(List<BenefitName> benefitNames, String benName, String inOut, String value) throws Exception {
		String format = "NOT_SET";
		String benValue;

		BenefitName benefitName = lookupBenefitName(benefitNames, benName);
		if (benefitName == null) {
			throw new IllegalArgumentException("Invalid benefitName passed: " + benName);
		}

		try {
			if (value == null || value.length() == 0) { 
				format = "NUMBER";
				benValue = "-1";
			} else if (value.toLowerCase().equals("n/a")) { 
				format = "STRING";
				benValue = "N/A";
			}else if (value.toLowerCase().equals("not covered")) { 
				format = "STRING";
				benValue = "Not Covered";
			} else if (value.startsWith("$")) {
				format = "DOLLAR";
				benValue = value.substring(1).replace(",", "");
				try {
					Long.parseLong(benValue);
				} catch (Exception e) {
					LOGGER.error("Bad benefit value, found DOLLAR sign but is not number value: " + value);
					throw e;
				}
			} else if (value.endsWith("%")) {
				format = "PERCENT";
				benValue = value.substring(0, value.length()-1);
				try {
					Long.parseLong(benValue);
				} catch (Exception e) {
					LOGGER.error("Bad benefit value, found PERCENT sign but is not number value: " + value);
					throw e;
				}
			} else if (value.endsWith("x")) {
				format = "MULTIPLE";
				benValue = value.substring(0, value.length()-1);
				try {
					Long.parseLong(benValue);
				} catch (Exception e) {
					LOGGER.error("Bad benefit value, found MULTIPLE sign but is not number value: " + value);
					throw e;
				}
			} else {
				format = "NUMBER";
				benValue = value.replaceAll(",", "");
				Long.parseLong(benName);
			}
		} catch (Exception e) {
			format = "STRING";
			benValue = value;
		}

		Benefit newBenefit = new Benefit();
		newBenefit.setBenefitName(benefitName);
		newBenefit.setInOutNetwork(inOut);
		newBenefit.setValue(benValue);
		//newBenefit.setRestriction(null);
		
		benefits.add(newBenefit);
	}

	private BenefitName lookupBenefitName(List<BenefitName> benefitNames, String benName) throws IllegalArgumentException {
		for (BenefitName bn : benefitNames) {
			if (bn.getName().equals(benName))
				return bn;
		}

		throw new IllegalArgumentException("Benefit with name: " + benName + " was not found in list of allowed benefits. Aborting.");
	}
}
