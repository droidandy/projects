package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "client_rfp_product")
public class ClientRfpProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_rfp_product_id")
    private Long clientRfpProductId;

    @Column (name = "client_id")
    private Long clientId;

    @ManyToOne
	@JoinColumn(name = "ext_product_id", referencedColumnName = "ext_product_id", nullable = false)
    private ExtProduct extProduct;
    
    @Column (name = "virgin_group")
    private boolean virginGroup;

    public ClientRfpProduct() {
	}

	public ClientRfpProduct(Long clientId, ExtProduct extProduct, boolean virginGroup) {
		this.clientId = clientId;
		this.extProduct = extProduct;
		this.virginGroup = virginGroup;
	}

	public Long getClientRfpProductId() {
		return clientRfpProductId;
	}

	public void setClientRfpProductId(Long clientRfpProductId) {
		this.clientRfpProductId = clientRfpProductId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public ExtProduct getExtProduct() {
		return extProduct;
	}

	public void setExtProduct(ExtProduct extProduct) {
		this.extProduct = extProduct;
	}

    public boolean isVirginGroup() {
        return virginGroup;
    }

    public void setVirginGroup(boolean virginGroup) {
        this.virginGroup = virginGroup;
    }
}
