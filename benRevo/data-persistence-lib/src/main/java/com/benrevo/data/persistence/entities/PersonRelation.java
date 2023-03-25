package com.benrevo.data.persistence.entities;

import java.util.Objects;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("PERSON")
public class PersonRelation extends Relation {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Person parent;

    public PersonRelation() {}

    public PersonRelation(Person parent, Person child) {
        this.parent = parent;
        this.person = child;
    }

    public Person getParent() {
        return parent;
    }

    public void setParent(Person parent) {
        this.parent = parent;
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), parent, person);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof PersonRelation)) {
            return false;
        }
        PersonRelation other = (PersonRelation) obj;

        return Objects.equals(getId(), other.getId()) 
            && Objects.equals(parent, other.parent) 
            && Objects.equals(person, other.person);
    }
}
