package com.benefit.data.model.carrier;

public class Network {
	private Integer id;
	private Integer carrierId;
	private String carrierName;
	public String name;
	public String type;
	public String tier;
		
	public Network(Integer id, Integer carrierId, String carrierName, String name, String type, String tier) {
		this.id = id;
		this.carrierId = carrierId;
		this.carrierName = carrierName;
		this.name = name;
		this.type = type;
		this.tier = tier;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getCarrierId() {
		return carrierId;
	}
	public void setCarrierId(Integer carrierId) {
		this.carrierId = carrierId;
	}
	public String getCarrierName() {
		return carrierName;
	}
	public void setCarrierName(String carrierName) {
		this.carrierName = carrierName;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTier() {
		return tier;
	}
	public void setTier(String tier) {
		this.tier = tier;
	}
	
	
}
