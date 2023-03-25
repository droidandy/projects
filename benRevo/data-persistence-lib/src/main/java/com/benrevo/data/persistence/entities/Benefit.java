package com.benrevo.data.persistence.entities;

import com.benrevo.common.util.BenefitFormatIdentifier;
import com.benrevo.data.persistence.converter.type.StringType;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator;

import javax.persistence.*;
import java.util.Date;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "benefit")
@JsonIdentityInfo(generator=PropertyGenerator.class, property="benefitId")
public class Benefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "benefit_id")
    private Long benefitId;

    @ManyToOne
    @JoinColumn(name = "plan_id", referencedColumnName = "plan_id", nullable = false)
    @JsonManagedReference
    private Plan plan;

    @ManyToOne
    @JoinColumn(name = "benefit_name_id")
    private BenefitName benefitName;

    @Column(name = "in_out_network")
    private String inOutNetwork;

    @Column(name = "format")
    private String format;

    @Column(name = "value")
    @Convert(converter = StringType.class)
    private String value;

    @Column(name = "restriction")
    private String restriction;

    @Column(name = "created")
    private Date created = new Date();

    @Column(name = "updated")
    private Date updated;

    public Long getBenefitId() {
        return benefitId;
    }

    public void setBenefitId(Long benefitId) {
        this.benefitId = benefitId;
    }

    public Plan getPlan() {
      return plan;
    }

    public void setPlan(Plan plan) {
      this.plan = plan;
    }

    public BenefitName getBenefitName() {
        return benefitName;
    }

    public void setBenefitName(BenefitName benefitName) {
        this.benefitName = benefitName;
    }

    public String getInOutNetwork() {
        return inOutNetwork;
    }

    public void setInOutNetwork(String inOutNetwork) {
        this.inOutNetwork = inOutNetwork;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getValue() {
        return value;
    }

    public String getRestriction() {
        return restriction;
    }

    public void setRestriction(String restriction) {
        this.restriction = restriction;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public void setValue(String value) {
        BenefitFormatIdentifier x = new BenefitFormatIdentifier(value).invoke();
        this.format = x.getFormat();
        this.value = x.getBenValue();
    }
    
    public Benefit copy() {
      Benefit copy = new Benefit();
      BeanUtils.copyProperties(this, copy, "benefitId");
      copy.setFormat(this.format);
      return copy; 
    }
}
