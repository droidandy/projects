package com.benrevo.data.persistence.entities;

import java.util.Objects;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("BROKERAGE")
public class BrokerPersonRelation extends Relation {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Broker broker;

    public BrokerPersonRelation() {}

    public BrokerPersonRelation(Broker broker, Person person) {
        this.broker = broker;
        this.person = person;
    }

    public Broker getBroker() {
        return broker;
    }
    
    public void setBroker(Broker broker) {
        this.broker = broker;
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), broker, person);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof BrokerPersonRelation)) {
            return false;
        }
        BrokerPersonRelation other = (BrokerPersonRelation) obj;

        return Objects.equals(getId(), other.getId()) 
            && Objects.equals(broker, other.broker) 
            && Objects.equals(person, other.person);
    }
}
