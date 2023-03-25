package com.benrevo.common.dto;

public class RfpCarrierDto {
    private Long rfpCarrierId;
    private String category;
    private String endpoint;
    private CarrierDto carrier;

    public RfpCarrierDto() {
    }

    public Long getRfpCarrierId() {
		return rfpCarrierId;
	}

	public void setRfpCarrierId(Long rfpCarrierId) {
		this.rfpCarrierId = rfpCarrierId;
	}

	public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public CarrierDto getCarrier() {
        return carrier;
    }

    public void setCarrier(CarrierDto carrier) {
        this.carrier = carrier;
    }

}
