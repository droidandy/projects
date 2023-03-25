package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import com.benrevo.common.enums.AttributeName;

@Entity
@DiscriminatorValue("CLIENT")
public class ClientAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private Client client;
    
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    protected AttributeName name;

    @Column(name = "value")
    private String value;

    public ClientAttribute() {
    }
    
    public ClientAttribute(Client client, AttributeName name) {
        this.client = client;
        this.name = name;
    }

    public ClientAttribute(Client client, AttributeName name, String value) {
        this.client = client;
        this.name = name;
        this.value = value;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
    
    public AttributeName getName() {
        return name;
    }

    public void setName(AttributeName name) {
        this.name = name;
    }
    
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ClientAttribute copy() {
      ClientAttribute copy = new ClientAttribute();
      BeanUtils.copyProperties(this, copy, "attributeId");
      return copy; 
  }


}
