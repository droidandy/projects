package com.benrevo.data.persistence.entities;

import com.benrevo.data.persistence.converter.type.StringType;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.Date;

@Entity
@Table(name = "plan_name_by_network")
public class PlanNameByNetwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pnn_id")
    private Long pnnId;

    @ManyToOne
    @JoinColumn(name = "plan_id", referencedColumnName = "plan_id", nullable = false)
    private Plan plan;

    @ManyToOne
    @JoinColumn(name = "network_id", referencedColumnName = "network_id", nullable = false)
    private Network network;

    @Column(name = "name")
    @Convert(converter = StringType.class)
    private String name;

    @Column(name = "plan_type")
    private String planType;

    @Column(name = "cost")
    private Long cost;

    @Column(name = "created")
    private Date created = new Date();

    @Column(name = "updated")
    private Date updated;

    @Column(name = "custom_plan")
    private boolean customPlan;

    @Column(name = "client_id")
    private Long clientId;


    public PlanNameByNetwork() {
    }

    public PlanNameByNetwork(Plan plan, Network network, String name, String planType) {
        this.plan = plan;
        this.network = network;
        this.name = name;
        this.planType = planType;
    }

    public Long getPnnId() {
        return pnnId;
    }

    public void setPnnId(Long pnnId) {
        this.pnnId = pnnId;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public Network getNetwork() {
        return network;
    }

    public void setNetwork(Network network) {
        this.network = network;
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

    public Long getCost() {
        return cost;
    }

    public void setCost(Long cost) {
        this.cost = cost;
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

    public boolean isCustomPlan() {
        return customPlan;
    }

    public void setCustomPlan(boolean customPlan) {
        this.customPlan = customPlan;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public PlanNameByNetwork copy() {
      PlanNameByNetwork copy = new PlanNameByNetwork();
      BeanUtils.copyProperties(this, copy, "pnnId"); // TODO: Should clientId be excluded as well?
      if (plan != null) {
        copy.setPlan(plan.copy());
      }
      return copy; 
    }
}