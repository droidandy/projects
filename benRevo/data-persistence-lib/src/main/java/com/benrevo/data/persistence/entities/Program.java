package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "program")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfp_carrier_id")
    private RfpCarrier rfpCarrier;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "description")
    private String description;
    public Program() {}
    
    public Long getProgramId() {
        return programId;
    }
    
    public void setProgramId(Long programId) {
        this.programId = programId;
    }
    
    public RfpCarrier getRfpCarrier() {
        return rfpCarrier;
    }
    
    public void setRfpCarrier(RfpCarrier rfpCarrier) {
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
