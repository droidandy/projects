package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "rider")
public class Rider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rider_id")
    private Long riderId;

    @Column (name = "tier1_rate")
    private Float tier1Rate;

    @Column (name = "tier2_rate")
    private Float tier2Rate;

    @Column (name = "tier3_rate")
    private Float tier3Rate;

    @Column (name = "tier4_rate")
    private Float tier4Rate;

    @ManyToOne
    @JoinColumn(name="rider_meta_id", referencedColumnName="rider_meta_id", nullable=false)
    private RiderMeta riderMeta;

    @Column (name = "`match`")
    private boolean match;

    // if it is set, it will override the one that is in rider_meta
    @Column (name = "selectable")
    private Boolean selectable;
    
    public Long getRiderId() {
        return riderId;
    }

    public void setRiderId(Long riderId) {
        this.riderId = riderId;
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

    public RiderMeta getRiderMeta() {
        return riderMeta;
    }

    public void setRiderMeta(RiderMeta riderMeta) {
        this.riderMeta = riderMeta;
    }

    public boolean isMatch() {
        return match;
    }

    public void setMatch(boolean match) {
        this.match = match;
    }

    public Boolean getSelectable() {
        return selectable;
    }

    public void setSelectable(Boolean selectable) {
        this.selectable = selectable;
    }

    @Override
    public int hashCode() {
        return Objects.hash(riderId);
    }
    
    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(!(obj instanceof Rider)) return false;

        Rider other = (Rider) obj;
        return Objects.equals(this.riderId, other.riderId) 
            && Objects.equals(this.riderMeta, other.riderMeta) 
            && Objects.equals(this.tier1Rate, other.tier1Rate)
            && Objects.equals(this.tier2Rate, other.tier2Rate) 
            && Objects.equals(this.tier3Rate, other.tier3Rate) 
            && Objects.equals(this.tier4Rate, other.tier4Rate);
    }
}
