package com.benrevo.common.params;

public class CarrierParams {

	private int id;
	private String category;

	public int getId() { //hack to support "send to carrier"  page
		return id;
	}
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}
	
	
}
