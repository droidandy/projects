package com.benefit.data.model.carrier;

public class Carrier {
	private Integer id;
	private String name;
	private String displayName;
	
	public Carrier(Integer id, String name, String displayName) {
		this.id = id;
		this.name = name;	
		this.displayName = displayName;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	
}
