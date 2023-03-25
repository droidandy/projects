package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.enums.UserAttributeName;

@Entity
@Table(name = "user_attribute")
public class UserAttribute {
    
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "user_attribute_id")
    private Long userAttributeId;

    @Column(name = "auth_id")
    private String authId;

    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    private UserAttributeName name;

    public UserAttribute() {
    }
    
    public UserAttribute(String authId, UserAttributeName name) {
        this.authId = authId;
        this.name = name;
    }

    public Long getUserAttributeId() {
        return userAttributeId;
    }

    public void setUserAttributeId(Long userAttributeId) {
        this.userAttributeId = userAttributeId;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public UserAttributeName getName() {
        return name;
    }

    public void setName(UserAttributeName name) {
        this.name = name;
    }
    
}
