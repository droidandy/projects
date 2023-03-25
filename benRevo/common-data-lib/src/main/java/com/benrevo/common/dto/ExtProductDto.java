package com.benrevo.common.dto;

import javax.xml.bind.annotation.XmlTransient;

public class ExtProductDto {

    @XmlTransient
    private Long extProductId;

    private String name;

    private String displayName;
    
    @XmlTransient
    private Double discount;
    
    @XmlTransient
    private Float discountPercent;
    
    private boolean virginGroup;

    public ExtProductDto() {
	}

    public ExtProductDto(Long extProductId, String name, String displayName, boolean virginGroup) {
		this.extProductId = extProductId;
		this.name = name;
		this.displayName = displayName;
		this.virginGroup = virginGroup;
	}

	public Long getExtProductId() {
		return extProductId;
	}

	public void setExtProductId(Long extProductId) {
		this.extProductId = extProductId;
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

	public Double getDiscount() {
		return discount;
	}

	public void setDiscount(Double discount) {
		this.discount = discount;
	}

	public Float getDiscountPercent() {
		return discountPercent;
	}

	public void setDiscountPercent(Float discountPercent) {
		this.discountPercent = discountPercent;
	}

    public boolean isVirginGroup() {
        return virginGroup;
    }

    public void setVirginGroup(boolean virginGroup) {
        this.virginGroup = virginGroup;
    }
}
