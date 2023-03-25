package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.enums.ConfigurationName;

@Entity
@Table(name = "configuration")
public class Configuration {
    
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "configuration_id")
    private Long configurationId;

    @Column (name = "carrier_id")
    private Long carrierId;

    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    private ConfigurationName name;

    @Column(name = "value")
    private String value;

    public Configuration() {
    }

    public Configuration(Long carrierId, ConfigurationName name, String value) {
        this.carrierId = carrierId;
        this.name = name;
        this.value = value;
    }

    public Long getConfigurationId() {
        return configurationId;
    }

    public void setConfigurationId(Long configurationId) {
        this.configurationId = configurationId;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public ConfigurationName getName() {
        return name;
    }

    public void setName(ConfigurationName name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    
    
}
