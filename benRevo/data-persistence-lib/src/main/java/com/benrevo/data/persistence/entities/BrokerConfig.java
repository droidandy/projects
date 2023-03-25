package com.benrevo.data.persistence.entities;

import java.util.Date;

import javax.persistence.*;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerConfigDto;
import com.benrevo.common.enums.BrokerConfigType;
import com.benrevo.common.util.DateHelper;

@Entity
@Table(name = "broker_config")
public class BrokerConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "broker_config_id")
    private Long brokerConfigId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "broker_id", nullable = false)
    private Broker broker;
    
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private BrokerConfigType type;

    @Column(name = "data")
    private String data;

    @Column(name = "modify_by")
    private String modifyBy;

    @Column(name = "modify_date")
    private Date modifyDate;

    public Long getBrokerConfigId() {
        return brokerConfigId;
    }

    public void setBrokerConfigId(Long brokerConfigId) {
        this.brokerConfigId = brokerConfigId;
    }

    public Broker getBroker() {
        return broker;
    }

    public void setBroker(Broker broker) {
        this.broker = broker;
    }

    public BrokerConfigType getType() {
        return type;
    }

    public void setType(BrokerConfigType type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getModifyBy() {
        return modifyBy;
    }

    public void setModifyBy(String modifyBy) {
        this.modifyBy = modifyBy;
    }

    public Date getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }

    public BrokerConfigDto toBrokerConfigDto() {
        BrokerConfigDto result = new BrokerConfigDto();
        result.setType(type);
        result.setData(data);
        result.setModifyBy(modifyBy);
        result.setModifyDate(DateHelper.fromDateToString(modifyDate, Constants.DATETIME_FORMAT));
        return result;
    }
}
