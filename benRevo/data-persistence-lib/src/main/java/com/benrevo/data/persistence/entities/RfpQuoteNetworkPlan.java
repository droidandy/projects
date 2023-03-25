package com.benrevo.data.persistence.entities;

import com.benrevo.data.persistence.converter.type.FloatType;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Where;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "rfp_quote_network_plan")
public class RfpQuoteNetworkPlan implements Tier4RatePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rfp_quote_network_plan_id")
    private Long rfpQuoteNetworkPlanId;

    @ManyToOne
    @JoinColumn(name = "rfp_quote_network_id", nullable = false)
    private RfpQuoteNetwork rfpQuoteNetwork;

    @Column(name = "match_plan")
    private boolean matchPlan;

    @Column(name = "voluntary")
    private boolean voluntary = false;

    @Column(name = "favorite")
    private boolean favorite = false;

    @ManyToOne
    @JoinColumn(name = "pnn_id", referencedColumnName = "pnn_id", nullable = false)
    private PlanNameByNetwork pnn;

    @Column(name = "tier1_rate")
    @Convert(converter = FloatType.class)
    private Float tier1Rate;

    @Column(name = "tier2_rate")
    @Convert(converter = FloatType.class)
    private Float tier2Rate;

    @Column(name = "tier3_rate")
    @Convert(converter = FloatType.class)
    private Float tier3Rate;

    @Column(name = "tier4_rate")
    @Convert(converter = FloatType.class)
    private Float tier4Rate;
    
    @JoinTable(name = "rider_rfp_quote_network_plan",
        joinColumns = {@JoinColumn(name = "rfp_quote_network_plan_id", referencedColumnName = "rfp_quote_network_plan_id")},
        inverseJoinColumns = {@JoinColumn(name = "rider_id", referencedColumnName = "rider_id")})
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Rider> riders = new HashSet<>();

    @OneToMany(mappedBy = "plan", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
    @Where(clause="type='QUOTE_PLAN'")
    private List<QuotePlanAttribute> attributes = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "rfp_quote_version_id",
                referencedColumnName = "rfp_quote_version_id",
                nullable = false)
    private RfpQuoteVersion rfpQuoteVersion;

    public RfpQuoteNetworkPlan() {
    }

    public RfpQuoteNetworkPlan(
        RfpQuoteNetwork rfpQuoteNetwork, PlanNameByNetwork pnn, Float tier1Rate,
        Float tier2Rate, Float tier3Rate, Float tier4Rate
    ) {
        this.rfpQuoteNetwork = rfpQuoteNetwork;
        this.pnn = pnn;
        this.tier1Rate = tier1Rate;
        this.tier2Rate = tier2Rate;
        this.tier3Rate = tier3Rate;
        this.tier4Rate = tier4Rate;
        this.rfpQuoteVersion = rfpQuoteNetwork.getRfpQuote().getRfpQuoteVersion();
    }

    public Long getRfpQuoteNetworkPlanId() {
        return rfpQuoteNetworkPlanId;
    }

    public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
        this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
    }

    public RfpQuoteNetwork getRfpQuoteNetwork() {
        return rfpQuoteNetwork;
    }

    public void setRfpQuoteNetwork(RfpQuoteNetwork rfpQuoteNetwork) {
        this.rfpQuoteNetwork = rfpQuoteNetwork;
    }

    public boolean isMatchPlan() {
        return matchPlan;
    }

    public void setMatchPlan(boolean matchPlan) {
        this.matchPlan = matchPlan;
    }

    public PlanNameByNetwork getPnn() {
        return pnn;
    }

    public void setPnn(PlanNameByNetwork pnn) {
        this.pnn = pnn;
    }

    public Float getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(Float tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public Float getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(Float tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public Float getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(Float tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public Float getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(Float tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public RfpQuoteVersion getRfpQuoteVersion() {
        return rfpQuoteVersion;
    }

    public void setRfpQuoteVersion(RfpQuoteVersion rfpQuoteVersion) {
        this.rfpQuoteVersion = rfpQuoteVersion;
    }
    
    public boolean isVoluntary() {
        return voluntary;
    }

    public void setVoluntary(boolean voluntary) {
        this.voluntary = voluntary;
    }

    public Set<Rider> getRiders() {
        return riders;
    }
    
    public void setRiders(Set<Rider> riders) {
        this.riders = riders;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public List<QuotePlanAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(
        List<QuotePlanAttribute> attributes) {
        this.attributes = attributes;
    }

    public RfpQuoteNetworkPlan copy() {
        RfpQuoteNetworkPlan copy = new RfpQuoteNetworkPlan();
        BeanUtils.copyProperties(this, copy, "rfpQuoteNetworkPlanId", "riders", "attributes");
        if(riders != null) {
            copy.getRiders().addAll(riders);
        }

        if (attributes != null) {
            for (QuotePlanAttribute attr : attributes) {
                QuotePlanAttribute attrCopy = attr.copy();
                attrCopy.setPlan(copy);
                copy.getAttributes().add(attrCopy);
            }
        }

        return copy; 
    }
}