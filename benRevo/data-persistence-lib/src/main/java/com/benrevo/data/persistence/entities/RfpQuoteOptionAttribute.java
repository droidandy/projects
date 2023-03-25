package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;

@Entity
@DiscriminatorValue("QUOTE_OPTION")
public class RfpQuoteOptionAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private RfpQuoteOption rfpQuoteOption;

    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    protected RfpQuoteOptionAttributeName name;

    @Column(name = "value")
    private String value;

    public RfpQuoteOptionAttribute() {
    }

    public RfpQuoteOptionAttribute(RfpQuoteOption rfpQuoteOption, RfpQuoteOptionAttributeName name, String value) {
        this.rfpQuoteOption = rfpQuoteOption;
        this.name = name;
        this.value = value;
    }

    public RfpQuoteOption getRfpQuoteOption() {
        return rfpQuoteOption;
    }

    public void setRfpQuoteOption(RfpQuoteOption rfpQuoteOption) {
        this.rfpQuoteOption = rfpQuoteOption;
    }

    public RfpQuoteOptionAttributeName getName() {
        return name;
    }

    public void setName(RfpQuoteOptionAttributeName name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public RfpQuoteOptionAttribute copy() {
        RfpQuoteOptionAttribute copy = new RfpQuoteOptionAttribute();
        copy.setName(name);
        copy.setValue(value);
        return copy;
    }

}
