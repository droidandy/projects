package com.benrevo.be.modules.admin.domain.quotes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.benrevo.data.persistence.entities.Benefit;

public class UploaderTestCase {
	private String category;
	private int tier;
	private String quoteFilename;
	private List<String> quoteFilename2List = new ArrayList<>();
	private List<String> rfpQuoteOptions;
	private Map<String, Integer> numPlansPerOption = new HashMap<String, Integer>();
	private Map<String, Integer> numRxPlansPerOption = new HashMap<String, Integer>();
	private Map<String, List<PlanInfo>> plansPerOption = new HashMap<String, List<PlanInfo>>();

	public int getTier() {
		return tier;
	}

	public void setTier(int tier) {
		this.tier = tier;
	}

	public String getCategory() {
		return category;
	}
	
	public void setCategory(String category) {
		this.category = category;
	}
	
	public String getQuoteFilename() {
		return quoteFilename;
	}
	
	public void setQuoteFilename(String quoteFilename) {
		this.quoteFilename = quoteFilename;
	}

	public List<String> getQuoteFilename2List() {
		return quoteFilename2List;
	}

	public void setQuoteFilename2List(List<String> quoteFilename2List) {
		this.quoteFilename2List = quoteFilename2List;
	}
	
	public List<String> getRfpQuoteOptions() {
		return rfpQuoteOptions;
	}
	
	public void setRfpQuoteOptions(List<String> rfpQuoteOptions) {
		this.rfpQuoteOptions = rfpQuoteOptions;
	}

	public Map<String, Integer> getNumPlansPerOption() {
		return numPlansPerOption;
	}
	
	public void addNumPlansPerOption(String optionName, int numPlans) {
		numPlansPerOption.put(optionName, numPlans);
	}

	public Map<String, Integer> getNumRxPlansPerOptions() {
		return numRxPlansPerOption;
	}
	
	public void addNumRxPlansPerOptions(String optionName, int numPlans) {
		numRxPlansPerOption.put(optionName, numPlans);
	}

	public void addPlanInfo(String optionName, String planName, boolean isMatchingPlan, Float t1Rate, Float t2Rate, Float t3Rate, Float t4Rate) {
		addPlanInfo(optionName, planName, isMatchingPlan, t1Rate, t2Rate, t3Rate, t4Rate, null, false);
	}
	public void addPlanInfo(String optionName, String planName, boolean isMatchingPlan, Float t1Rate, Float t2Rate, Float t3Rate, Float t4Rate, 
			List<BenefitInfo> benefitInfos, boolean customPlan) {
		if (plansPerOption.get(optionName) == null) {
			plansPerOption.put(optionName, new ArrayList<PlanInfo>());
		}
		plansPerOption.get(optionName).add(new PlanInfo(planName, isMatchingPlan, t1Rate, t2Rate, t3Rate, t4Rate, benefitInfos, customPlan));
	}
	
	public Map<String, List<PlanInfo>> getPlansPerOption() {
		return plansPerOption;
	}

	public static class BenefitInfo {
		private String benefitName;
		private String format;
		private String inOutNetwork;
		private String value;
		
		public BenefitInfo(String benefitName, String format, String inOutNetwork, String value) {
			this.benefitName = benefitName;
			this.format = format;
			this.inOutNetwork = inOutNetwork;
			this.value = value;
		}
		
		public String toString() {
			return "benefitName=" + benefitName + ", format=" + format + ", inOutNetwork=" + inOutNetwork + ", value=" + value;
		}

		public boolean matchesBenefit(Benefit b) {
			return b.getBenefitName().getName().equals(benefitName) && b.getFormat().equals(format) && b.getInOutNetwork().equals(inOutNetwork)
					&& b.getValue().equals(value);
		}
	}
	
	public static class PlanInfo {
		private String planName;
		private Float[] rates;
		private boolean isMatchingPlan;
		private List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
		private boolean customPlan;

		public PlanInfo(String planName, boolean isMatchingPlan, Float t1Rate, Float t2Rate, Float t3Rate, Float t4Rate, 
				List<BenefitInfo> benefitInfos, boolean customPlan) {
			this.planName = planName;
			this.isMatchingPlan = isMatchingPlan;
			this.rates = new Float[4];
			this.rates[0] = t1Rate;
			this.rates[1] = t2Rate;
			this.rates[2] = t3Rate;
			this.rates[3] = t4Rate;
			if (benefitInfos != null) {
				addBenefitInfos(benefitInfos);
			}
			this.setCustomPlan(customPlan);
		}

		public String getPlanName() {
			return planName;
		}

		public void setPlanName(String planName) {
			this.planName = planName;
		}

		public Float[] getRates() {
			return rates;
		}

		public void setRates(Float[] rates) {
			this.rates = rates;
		}

		public boolean isMatchingPlan() {
			return isMatchingPlan;
		}

		public void setMatchingPlan(boolean isMatchingPlan) {
			this.isMatchingPlan = isMatchingPlan;
		}

		public List<BenefitInfo> getBenefitInfos() {
			return benefitInfos;
		}

		public void addBenefitInfos(List<BenefitInfo> benefitInfos) {
			this.benefitInfos.addAll(benefitInfos);
		}

		public boolean isCustomPlan() {
			return customPlan;
		}

		public void setCustomPlan(boolean customPlan) {
			this.customPlan = customPlan;
		}
	}
}
