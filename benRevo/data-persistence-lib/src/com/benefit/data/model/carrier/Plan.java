package com.benefit.data.model.carrier;

import java.util.List;

import com.benefit.data.model.Benefit;

public class Plan {
	private List<Benefit> benefits;
	
	public Plan(){
	}
	
	public void setBenefits(List<Benefit> list) {
		benefits = list;
	}

	public List<Benefit> getBenefits() {
		return benefits;
	}
	
	public Benefit getBenefit(Benefit benefit) {
		int index = benefits.indexOf(benefit);
		if(index > -1) {
			return benefits.get(index);		
		}
		return null;
	}
}
