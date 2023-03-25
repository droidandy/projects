package com.benrevo.data.persistence.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("BROKERAGE")
public class ExtBrokerageAccess extends Access {

    @ManyToOne(optional = false)
    @JoinColumn(name = "target")
    private Broker broker;

    @ManyToOne(optional = false)
    @JoinColumn(name = "origin")
    private Broker extBroker;

    public ExtBrokerageAccess() {
        super();
    }
    
    public ExtBrokerageAccess(Broker extBroker, Broker broker) {
        this.extBroker = extBroker;
        this.broker = broker;
    }

    public Broker getBroker() {
        return broker;
    }

    public void setBroker(Broker broker) {
        this.broker = broker;
    }

    public Broker getExtBroker() {
        return extBroker;
    }

    public void setExtBroker(Broker extBroker) {
        this.extBroker = extBroker;
    }
}