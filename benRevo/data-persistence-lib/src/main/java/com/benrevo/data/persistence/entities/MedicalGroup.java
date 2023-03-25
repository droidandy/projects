package com.benrevo.data.persistence.entities;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import java.util.List;

@Entity
@Table(name = "medical_group")
public class MedicalGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medical_group_id")
    private Long medicalGroupId;

    @Column	(name = "dec_number")
    private String decNumber;

    @Column	(name = "name")
    private String name;

    @Column	(name = "county")
    private String county;

    @Column	(name = "region")
    private String region;

    @Column	(name = "state")
    private String state;
    
    @ManyToOne
    @JoinColumn(name="carrier_id", referencedColumnName="carrier_id", nullable=false)
    private Carrier carrier;

    @OneToMany(mappedBy = "medicalGroup", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Fetch(FetchMode.SUBSELECT)
    private List<NetworkMedicalGroup> networkMedicalGroups;

    public Long getMedicalGroupId() {
        return medicalGroupId;
    }

    public void setMedicalGroupId(Long medicalGroupId) {
        this.medicalGroupId = medicalGroupId;
    }

    public String getDecNumber() {
        return decNumber;
    }

    public void setDecNumber(String decNumber) {
        this.decNumber = decNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Carrier getCarrier() {
        return carrier;
    }

    public void setCarrier(Carrier carrier) {
        this.carrier = carrier;
    }

    public List<NetworkMedicalGroup> getNetworkMedicalGroups() {
        return networkMedicalGroups;
    }

    public void setNetworkMedicalGroups(List<NetworkMedicalGroup> networkMedicalGroups) {
        this.networkMedicalGroups = networkMedicalGroups;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MedicalGroup)) return false;

        MedicalGroup that = (MedicalGroup) o;

        if (!county.equals(that.county)) return false;
        if (!decNumber.equals(that.decNumber)) return false;
        if (!medicalGroupId.equals(that.medicalGroupId)) return false;
        if (!name.equals(that.name)) return false;
        if (region != null ? !region.equals(that.region) : that.region != null) return false;
        if (state != null ? !state.equals(that.state) : that.state != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = medicalGroupId.hashCode();
        result = 31 * result + decNumber.hashCode();
        result = 31 * result + name.hashCode();
        result = 31 * result + county.hashCode();
        result = 31 * result + (region != null ? region.hashCode() : 0);
        result = 31 * result + (state != null ? state.hashCode() : 0);
        return result;
    }
}
