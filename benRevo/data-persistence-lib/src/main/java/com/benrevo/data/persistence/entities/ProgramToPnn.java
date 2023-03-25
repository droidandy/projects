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
@Table(name = "program_to_pnn")
public class ProgramToPnn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_to_pnn_id")
    private Long programToPnnId;
    
    @Column(name = "program_id")
    private Long programId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pnn_id")
    private PlanNameByNetwork pnn;
 
    public ProgramToPnn() {}
    
    public Long getProgramId() {
        return programId;
    }
    
    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getProgramToPnnId() {
        return programToPnnId;
    }

    public void setProgramToPnnId(Long programToPnnId) {
        this.programToPnnId = programToPnnId;
    }
 
    public PlanNameByNetwork getPnn() {
        return pnn;
    }

    public void setPnn(PlanNameByNetwork pnn) {
        this.pnn = pnn;
    }
}
