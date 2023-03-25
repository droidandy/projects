package com.benrevo.data.persistence.entities;

import com.benrevo.data.persistence.converter.type.StringType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "plan")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @ManyToOne
    @JoinColumn(name = "carrier_id",
                columnDefinition = "BIGINT(20)",
                referencedColumnName = "carrier_id",
                nullable = false)
    private Carrier carrier;

    @Column(name = "name")
    @Convert(converter = StringType.class)
    private String name;

    @Column(name = "plan_type")
    @Convert(converter = StringType.class)
    private String planType;

    @Column(name = "created")
    private Date created = new Date();

    @Column(name = "updated")
    private Date updated;
    
    @Column(name = "plan_year")
    private Integer planYear = Year.now().getValue();
    
    @OneToMany(mappedBy = "plan",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true)
    @JsonBackReference
    private List<Benefit> benefits;

    public Plan() {
    }

    public Plan(Carrier carrier, String name, String planType) {
        this.carrier = carrier;
        this.name = name;
        this.planType = planType;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public Carrier getCarrier() {
        return carrier;
    }

    public void setCarrier(Carrier carrier) {
        this.carrier = carrier;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
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

    public Integer getPlanYear() {
        return planYear;
    }
    
    public void setPlanYear(Integer planYear) {
        this.planYear = planYear;
    }

    public List<Benefit> getBenefits() {
      return benefits;
    }

    public void setBenefits(List<Benefit> benefits) {
      this.benefits = benefits;
    }
    
    public Plan copy() {
      Plan copy = new Plan();
      BeanUtils.copyProperties(this, copy, "planId");
      if (benefits != null) {
        copy.setBenefits(new ArrayList<>());
        for (Benefit ben : benefits) {
          Benefit benCopy = ben.copy();
          benCopy.setPlan(copy);
          copy.getBenefits().add(benCopy);
        } 
      }
      return copy; 
    }
}
