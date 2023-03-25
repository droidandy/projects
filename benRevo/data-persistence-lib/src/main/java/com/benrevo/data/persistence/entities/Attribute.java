package com.benrevo.data.persistence.entities;

import javax.persistence.*;

import com.benrevo.common.enums.AttributeName;

@Entity
@Table(name = "attribute")
@DiscriminatorColumn(name="type")
public abstract class Attribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attribute_id")
    protected Long attributeId;

    public Long getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(Long attributeId) {
        this.attributeId = attributeId;
    }


}
