package com.benrevo.data.persistence.entities;

import java.util.Objects;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("CLIENT")
public class ClientPersonRelation extends Relation {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Client client;

    public ClientPersonRelation() {}

    public ClientPersonRelation(Client client, Person person) {
        this.client = client;
        this.person = person;
    }

    public Client getClient() {
        return client;
    }
    
    public void setClient(Client client) {
        this.client = client;
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), client, person);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof ClientPersonRelation)) {
            return false;
        }
        ClientPersonRelation other = (ClientPersonRelation) obj;

        return Objects.equals(getId(), other.getId()) 
            && Objects.equals(client, other.client) 
            && Objects.equals(person, other.person);
    }
}
