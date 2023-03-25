package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "network_medical_group")
public class NetworkMedicalGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "network_medical_group_id")
    private Long networkMedicalGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="network_id", referencedColumnName = "network_id", nullable=false)
    private Network network;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="medical_group_id", referencedColumnName = "medical_group_id", nullable=false)
    private MedicalGroup medicalGroup;

    @Column	(name = "meta")
    private String meta;

    public Long getNetworkMedicalGroupId() {
        return networkMedicalGroupId;
    }

    public void setNetworkMedicalGroupId(Long networkMedicalGroupId) {
        this.networkMedicalGroupId = networkMedicalGroupId;
    }

    public Network getNetwork() {
        return network;
    }

    public void setNetwork(Network network) {
        this.network = network;
    }

    public MedicalGroup getMedicalGroup() {
        return medicalGroup;
    }

    public void setMedicalGroup(MedicalGroup medicalGroup) {
        this.medicalGroup = medicalGroup;
    }

    public String getMeta() {
        return meta;
    }

    public void setMeta(String meta) {
        this.meta = meta;
    }
}