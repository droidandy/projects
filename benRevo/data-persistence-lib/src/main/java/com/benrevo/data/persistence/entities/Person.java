package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.PersonType;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long personId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "full_name")
    private String fullName; 

    @Column(name = "email")
    private String email;

    @Column(name = "`type`")
    @Enumerated(EnumType.STRING)
    private PersonType type;

    @Column(name = "carrier_id")
    private Long carrierId;

    public Person() {}

    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PersonType getType() {
        return type;
    }

    public void setType(PersonType type) {
        this.type = type;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(personId, firstName, lastName, fullName, type, email);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof Person)) {
            return false;
        }
        Person other = (Person) obj;

        return Objects.equals(personId, other.personId) 
            && Objects.equals(firstName, other.firstName) 
            && Objects.equals(lastName, other.lastName) 
            && Objects.equals(fullName, other.fullName) 
            && Objects.equals(type, other.type)
            && Objects.equals(email, other.email);
    }

}
