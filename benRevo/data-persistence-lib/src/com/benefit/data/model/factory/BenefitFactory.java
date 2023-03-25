package com.benefit.data.model.factory;

import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.List;

import com.benefit.data.loader.BenefitDBLoader;
import com.benefit.data.model.Benefit;
import com.benefit.data.model.DollarBenefit;
import com.benefit.data.model.MulipleBenefit;
import com.benefit.data.model.NoFormatBenefit;
import com.benefit.data.model.PercentBenefit;
import com.benefit.data.model.carrier.BenefitName;
import com.benefit.data.model.carrier.Carrier;
import com.benefit.data.util.BenefitUtil;


public class BenefitFactory {
	private HashMap<String, Integer> carrierMap;
	private HashMap<String, Integer> benefitNameMap;
	
	private static BenefitFactory factory = null;
	
	private BenefitFactory() {
		loadCarrierPlanBenefitNames();
	}
	
	public static BenefitFactory getInstance() {
		if(null == factory){
			factory = new BenefitFactory();
		}
		return factory;
	}
	
	
	private void loadCarrierPlanBenefitNames() {
		BenefitDBLoader db = new BenefitDBLoader();
		carrierMap = new HashMap<String, Integer>();
		benefitNameMap = new HashMap<String, Integer>();
		
		List<Carrier> carriers = db.getCarriers();
		for(int index = 0; index < carriers.size(); index++){
			Carrier c = carriers.get(index);
			carrierMap.put(c.getDisplayName(), c.getId());
		}
		
		List<BenefitName> benefitNames = db.getBenefitNames();
		for(int index = 0; index < benefitNames.size(); index++){
			BenefitName b = benefitNames.get(index);
			benefitNameMap.put(b.getDisplayName(), b.getId());
		}
		
		db.close();
	}

	
	//Cigna,A,IN,Individual OOP Limit,1000,Includes all copays except Rx len:6
	public Benefit createBenefit(Integer planId, String inOutNetwork, String name, String value, String restriction /*,
										String signatureNetwork, String advantageNetwork, String allianceNetwork*/) {
		Benefit b = null;
		String strNum = "";
		
		value = value.trim();
		inOutNetwork = inOutNetwork.trim();
		name = name.trim();
		restriction = value.trim();
	
		//validateCarrierDisplayName(carrier);
		Integer benefitNameId = getBenefitNameId(name);
	
		//Remove quotes from value
		if(value.startsWith("\"")) { 
			value = value.substring(1, value.length()-2);
		}
		if(restriction.startsWith("\"")) {
			restriction = restriction.substring(1, restriction.length()-2);
		}
		
		//Extract the correct value type
		if(null == value || value.length() == 0) {
			value = "-1";
		}
		else if(value.toLowerCase().equals("n/a")) {
			value = "-2";
		}
		else if(value.toLowerCase().equals("not covered")) {
			value = "-3";
		}
		/*
		if(value.contains("/")){
			b = new DulDollarBenefit(value, Benefit.Format.DUL_DOLLAR);
		} else */ 
		int number; 
		if(value.startsWith("$")) {
			strNum = value.substring(1).replace(",", "");
			number = Integer.parseInt(strNum);
			b = new DollarBenefit(number);
		} else if(value.endsWith("%")) {
			strNum = value.substring(0,value.length()-1);
			number = Integer.parseInt(strNum);
			b = new PercentBenefit(number);
		} else if(value.toLowerCase().endsWith("x")) {
			strNum = value.substring(0,value.length()-1); 
			number = Integer.parseInt(strNum);
			b = new MulipleBenefit(number);
		}else {
			try {
				number = Integer.parseInt(value);
				b = new NoFormatBenefit(number);
			} catch(NumberFormatException e) {
				throw new InvalidParameterException("Invalid benefit type found: " + value); 
			}
		}
		
		b.setBenefitDetails(planId, benefitNameId, inOutNetwork, restriction);
		return b; 
	}

	private Integer getBenefitNameId(String name) {
		
		Integer id = benefitNameMap.get(name);
		if(null == id) {
			throw new InvalidParameterException(name + " is not a valid benefit name, please check.");
		}
		return id;
	}

	public void validateCarrierDisplayName(String carrier) {
		Integer id = carrierMap.get(carrier);
		if(null == id) {
			throw new InvalidParameterException(carrier + " is not a valid carrier name, please check.");
		}
	}
}