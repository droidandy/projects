package com.benrevo.data.persistence.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("CLIENT")
public class ExtClientAccess extends Access {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin")
    private Broker extBroker;

    public ExtClientAccess() {
        super();
    }
    
    public ExtClientAccess(Broker extBroker, Client client) {
        this.extBroker = extBroker;
        this.client = client;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Broker getExtBroker() {
        return extBroker;
    }

    public void setExtBroker(Broker extBroker) {
        this.extBroker = extBroker;
    }

}