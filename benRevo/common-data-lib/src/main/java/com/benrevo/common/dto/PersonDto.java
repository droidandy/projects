package com.benrevo.common.dto;

import com.benrevo.common.enums.PersonType;
import java.util.List;

public class PersonDto {

    private Long personId;

    private String firstName;

    private String lastName;
    
    private String fullName; 

    private String email;

    private PersonType type;

    private Long carrierId;

    private List<BrokerDto> brokerageList;

    public PersonDto() {}

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

    public List<BrokerDto> getBrokerageList() {
        return brokerageList;
    }

    public void setBrokerageList(List<BrokerDto> brokerageList) {
        this.brokerageList = brokerageList;
    }
}
