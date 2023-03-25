package com.benrevo.common.dto;

import com.benrevo.common.enums.PlanRateType;
import javax.validation.constraints.NotNull;

public class CreateProgramQuoteDto {
    @NotNull
    private Long programId;
    @NotNull
    private Long clientId;
    
    private Float ratingBand;
    private Float commission; // percent: 6%, 10%, ...
    private PlanRateType rateType;
    private String rateTypeValue;

    // CLSA Trust
    private String zipCode;
    private String region;
    private String averageAge;
    private String numEligibleEmployees;


    public CreateProgramQuoteDto() {}

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public PlanRateType getRateType() {
        return rateType;
    }

    public void setRateType(PlanRateType rateType) {
        this.rateType = rateType;
    }

    public String getRateTypeValue() {
        return rateTypeValue;
    }

    public void setRateTypeValue(String rateTypeValue) {
        this.rateTypeValue = rateTypeValue;
    }

    public Float getCommission() {
        return commission;
    }

    public void setCommission(Float commission) {
        this.commission = commission;
    }

    public Float getRatingBand() {
        return ratingBand;
    }

    public void setRatingBand(Float ratingBand) {
        this.ratingBand = ratingBand;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getAverageAge() {
        return averageAge;
    }
    
    public void setAverageAge(String averageAge) {
        this.averageAge = averageAge;
    }
    
    public String getNumEligibleEmployees() {
        return numEligibleEmployees;
    }
    
    public void setNumEligibleEmployees(String numEligibleEmployees) {
        this.numEligibleEmployees = numEligibleEmployees;
    }
}
