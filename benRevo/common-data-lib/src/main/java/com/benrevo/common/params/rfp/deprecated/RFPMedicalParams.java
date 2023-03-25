package com.benrevo.common.params.rfp.deprecated;

import com.benrevo.common.params.RFPParams;


/**
 * DEPRECATED: This class should be deleted
 */

public class RFPMedicalParams extends RFPParams{

	/*
	private int set;
	//page 1
	private String eligible;
	private String numOfDays;
	private String commSchdlHow;
	private String commSchdlCommission;
	private String currCarrier;
	private String currYears;
	private String addPrev;

	//page 2
	private int tier;
	private int optCnt;
	private String base;
	private String option1;
	private String option2;
	private String option3;
	private String option4;
	private String option5;
	
	//plan 3
	private String contribution;
	private String buyUp;
	private int base_tier1;
	private int opt1_tier1;
	private int opt2_tier1;
	private int opt3_tier1;
	private int opt4_tier1;
	private int opt5_tier1;
	
	private int base_tier2;
	private int opt1_tier2;
	private int opt2_tier2;
	private int opt3_tier2;
	private int opt4_tier2;
	private int opt5_tier2;
	
	private int base_tier3;
	private int opt1_tier3;
	private int opt2_tier3;
	private int opt3_tier3;
	private int opt4_tier3;
	private int opt5_tier3;
	
	private int base_tier4;
	private int opt1_tier4;
	private int opt2_tier4;
	private int opt3_tier4;
	private int opt4_tier4;
	private int opt5_tier4;
	
	//page 4
	private String funding;
	private String alongside;
	private String quoteAltTier;
	private String request;
	
	
	
	public int getSet() {
		return set;
	}
	public void setSet(int set) {
		this.set = set;
	}
	public String getEligible() {
		return eligible;
	}
	public void setEligible(String eligible) {
		this.eligible = eligible;
	}
	public String getNumOfDays() {
		return numOfDays;
	}
	public void setNumOfDays(String numOfDays) {
		this.numOfDays = numOfDays;
	}
	public String getCommSchdlHow() {
		return commSchdlHow;
	}
	public void setCommSchdlHow(String commSchdlHow) {
		this.commSchdlHow = commSchdlHow;
	}
	public String getCommSchdlCommission() {
		return commSchdlCommission;
	}
	public void setCommSchdlCommission(String commSchdlCommission) {
		this.commSchdlCommission = commSchdlCommission;
	}
	public String getCurrCarrier() {
		return currCarrier;
	}
	public void setCurrCarrier(String currCarrier) {
		this.currCarrier = currCarrier;
	}
	public String getCurrYears() {
		return currYears;
	}
	public void setCurrYears(String currYears) {
		this.currYears = currYears;
	}
	public String getAddPrev() {
		return addPrev;
	}
	public void setAddPrev(String addPrev) {
		this.addPrev = addPrev;
	}
	public int getTier() {
		return tier;
	}
	public void setTier(int tier) {
		this.tier = tier;
	}
	public int getOptCnt() {
		return optCnt;
	}
	public void setOptCnt(int optCnt) {
		this.optCnt = optCnt;
	}
	public String getBase() {
		return base;
	}
	public void setBase(String base) {
		this.base = base;
	}
	public String getOption1() {
		return option1;
	}
	public void setOption1(String option1) {
		this.option1 = option1;
	}
	public String getOption2() {
		return option2;
	}
	public void setOption2(String option2) {
		this.option2 = option2;
	}
	public String getOption3() {
		return option3;
	}
	public void setOption3(String option3) {
		this.option3 = option3;
	}
	public String getOption4() {
		return option4;
	}
	public void setOption4(String option4) {
		this.option4 = option4;
	}
	public String getOption5() {
		return option5;
	}
	public void setOption5(String option5) {
		this.option5 = option5;
	}
	public String getContribution() {
		return contribution;
	}
	public void setContribution(String contribution) {
		this.contribution = contribution;
	}
	public String getBuyUp() {
		return buyUp;
	}
	public void setBuyUp(String buyUp) {
		this.buyUp = buyUp;
	}
	public int getBase_tier1() {
		return base_tier1;
	}
	public void setBase_tier1(int base_tier1) {
		this.base_tier1 = base_tier1;
	}
	public int getOpt1_tier1() {
		return opt1_tier1;
	}
	public void setOpt1_tier1(int opt1_tier1) {
		this.opt1_tier1 = opt1_tier1;
	}
	public int getOpt2_tier1() {
		return opt2_tier1;
	}
	public void setOpt2_tier1(int opt2_tier1) {
		this.opt2_tier1 = opt2_tier1;
	}
	public int getOpt3_tier1() {
		return opt3_tier1;
	}
	public void setOpt3_tier1(int opt3_tier1) {
		this.opt3_tier1 = opt3_tier1;
	}
	public int getOpt4_tier1() {
		return opt4_tier1;
	}
	public void setOpt4_tier1(int opt4_tier1) {
		this.opt4_tier1 = opt4_tier1;
	}
	public int getOpt5_tier1() {
		return opt5_tier1;
	}
	public void setOpt5_tier1(int opt5_tier1) {
		this.opt5_tier1 = opt5_tier1;
	}
	public int getBase_tier2() {
		return base_tier2;
	}
	public void setBase_tier2(int base_tier2) {
		this.base_tier2 = base_tier2;
	}
	public int getOpt1_tier2() {
		return opt1_tier2;
	}
	public void setOpt1_tier2(int opt1_tier2) {
		this.opt1_tier2 = opt1_tier2;
	}
	public int getOpt2_tier2() {
		return opt2_tier2;
	}
	public void setOpt2_tier2(int opt2_tier2) {
		this.opt2_tier2 = opt2_tier2;
	}
	public int getOpt3_tier2() {
		return opt3_tier2;
	}
	public void setOpt3_tier2(int opt3_tier2) {
		this.opt3_tier2 = opt3_tier2;
	}
	public int getOpt4_tier2() {
		return opt4_tier2;
	}
	public void setOpt4_tier2(int opt4_tier2) {
		this.opt4_tier2 = opt4_tier2;
	}
	public int getOpt5_tier2() {
		return opt5_tier2;
	}
	public void setOpt5_tier2(int opt5_tier2) {
		this.opt5_tier2 = opt5_tier2;
	}
	public int getBase_tier3() {
		return base_tier3;
	}
	public void setBase_tier3(int base_tier3) {
		this.base_tier3 = base_tier3;
	}
	public int getOpt1_tier3() {
		return opt1_tier3;
	}
	public void setOpt1_tier3(int opt1_tier3) {
		this.opt1_tier3 = opt1_tier3;
	}
	public int getOpt2_tier3() {
		return opt2_tier3;
	}
	public void setOpt2_tier3(int opt2_tier3) {
		this.opt2_tier3 = opt2_tier3;
	}
	public int getOpt3_tier3() {
		return opt3_tier3;
	}
	public void setOpt3_tier3(int opt3_tier3) {
		this.opt3_tier3 = opt3_tier3;
	}
	public int getOpt4_tier3() {
		return opt4_tier3;
	}
	public void setOpt4_tier3(int opt4_tier3) {
		this.opt4_tier3 = opt4_tier3;
	}
	public int getOpt5_tier3() {
		return opt5_tier3;
	}
	public void setOpt5_tier3(int opt5_tier3) {
		this.opt5_tier3 = opt5_tier3;
	}
	public int getBase_tier4() {
		return base_tier4;
	}
	public void setBase_tier4(int base_tier4) {
		this.base_tier4 = base_tier4;
	}
	public int getOpt1_tier4() {
		return opt1_tier4;
	}
	public void setOpt1_tier4(int opt1_tier4) {
		this.opt1_tier4 = opt1_tier4;
	}
	public int getOpt2_tier4() {
		return opt2_tier4;
	}
	public void setOpt2_tier4(int opt2_tier4) {
		this.opt2_tier4 = opt2_tier4;
	}
	public int getOpt3_tier4() {
		return opt3_tier4;
	}
	public void setOpt3_tier4(int opt3_tier4) {
		this.opt3_tier4 = opt3_tier4;
	}
	public int getOpt4_tier4() {
		return opt4_tier4;
	}
	public void setOpt4_tier4(int opt4_tier4) {
		this.opt4_tier4 = opt4_tier4;
	}
	public int getOpt5_tier4() {
		return opt5_tier4;
	}
	public void setOpt5_tier4(int opt5_tier4) {
		this.opt5_tier4 = opt5_tier4;
	}
	public String getFunding() {
		return funding;
	}
	public void setFunding(String funding) {
		this.funding = funding;
	}
	public String getAlongside() {
		return alongside;
	}
	public void setAlongside(String alongside) {
		this.alongside = alongside;
	}
	public String getQuoteAltTier() {
		return quoteAltTier;
	}
	public void setQuoteAltTier(String quoteAltTier) {
		this.quoteAltTier = quoteAltTier;
	}
	public String getRequest() {
		return request;
	}
	public void setRequest(String request) {
		this.request = request;
	}

	*/
}
