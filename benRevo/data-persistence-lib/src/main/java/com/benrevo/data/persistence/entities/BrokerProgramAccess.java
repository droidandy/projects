package com.benrevo.data.persistence.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("PROGRAM")
public class BrokerProgramAccess extends Access {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target")
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin")
    private Broker broker;

    public BrokerProgramAccess() {
        super();
    }
    
    public BrokerProgramAccess(Broker broker, Program program) {
        this.broker = broker;
        this.program = program;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public Broker getBroker() {
        return broker;
    }

    public void setBroker(Broker broker) {
        this.broker = broker;
    }
}