package com.benrevo.common.dto;


public class AdministrativeFeeDto {

    private Long administrativeFeeId;

    private Long carrierId;

    private String name;

    private Float value;

    public AdministrativeFeeDto() {
    }

	public Long getAdministrativeFeeId() {
		return administrativeFeeId;
	}

	public void setAdministrativeFeeId(Long administrativeFeeId) {
		this.administrativeFeeId = administrativeFeeId;
	}

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}
}