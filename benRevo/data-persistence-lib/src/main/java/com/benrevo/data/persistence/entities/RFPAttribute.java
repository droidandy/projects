package com.benrevo.data.persistence.entities;

import java.util.ArrayList;
import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import com.benrevo.common.enums.RFPAttributeName;

@Entity
@DiscriminatorValue("RFP")
public class RFPAttribute extends Attribute {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "ref")
    private RFP rfp;
    
    @Column(name = "name")
    @Enumerated(EnumType.STRING)
    protected RFPAttributeName name;
    
    @Column(name = "value")
    private String value;

    public RFPAttribute() {
    }
    
    public RFPAttribute(RFP rfp, RFPAttributeName name, String value) {
        this.rfp = rfp;
        this.name = name;
        this.value = value;
    }

    public RFP getRfp() {
        return rfp;
    }

    public void setRfp(RFP rfp) {
        this.rfp = rfp;
    }

    public RFPAttributeName getName() {
        return name;
    }

    public void setName(RFPAttributeName name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public RFPAttribute copy() {
        RFPAttribute copy = new RFPAttribute();
        copy.setName(name);
        copy.setValue(value);
        return copy;
    }

}
