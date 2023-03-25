package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "carrier_history")
public class CarrierHistory {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column	(name = "id", columnDefinition = "BIGINT(20)")
    private Long id;

    @Column (name = "name")
    private String name;

    @Column (name = "years")
    private int years;

    @Column (name = "current")
    private boolean current;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfp_id", nullable = false)
    private RFP rfp;

    public CarrierHistory() {}

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

    public RFP getRfp() {
        return rfp;
    }

    public void setRfp(RFP rfp) {
        this.rfp = rfp;
    }
    
    public CarrierHistory copy() {
      CarrierHistory copy = new CarrierHistory();
      BeanUtils.copyProperties(this, copy, "id");
      return copy;
    }
}
