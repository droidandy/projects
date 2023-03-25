package com.benrevo.common.dto;

public class ProgramDto {
    
    private Long programId;
    private RfpCarrierDto rfpCarrier;
    private String name;
    private String description;
    
    public ProgramDto() {}

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public RfpCarrierDto getRfpCarrier() {
        return rfpCarrier;
    }
    
    public void setRfpCarrier(RfpCarrierDto rfpCarrier) {
        this.rfpCarrier = rfpCarrier;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
