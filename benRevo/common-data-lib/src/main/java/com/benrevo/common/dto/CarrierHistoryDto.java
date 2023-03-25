package com.benrevo.common.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@XmlAccessorType(XmlAccessType.FIELD)
public class CarrierHistoryDto {

    @XmlTransient    
    private Long id;

    private String name;

    private int years;

    private boolean current;

    @XmlTransient 
    private Long rfpId;

    public CarrierHistoryDto(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getYears() {
        return years;
    }

    public void setYears(int years) {
        this.years = years;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }

    public Long getRfpId() {
        return rfpId;
    }

    public void setRfpId(Long rfpId) {
        this.rfpId = rfpId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof CarrierHistoryDto)) {
            return false;
        }

        CarrierHistoryDto that = (CarrierHistoryDto) o;

        return new EqualsBuilder()
            .append(getYears(), that.getYears())
            .append(isCurrent(), that.isCurrent())
            .append(getId(), that.getId())
            .append(getName(), that.getName())
            .append(getRfpId(), that.getRfpId())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getName())
            .append(getYears())
            .append(isCurrent())
            .append(getRfpId())
            .toHashCode();
    }
    
}
