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
@Table(name = "client_ext_product")
public class ClientExtProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_ext_product_id")
    private Long clientExtProductId;

    @Column (name = "client_id")
    private Long clientId;

    @ManyToOne
	@JoinColumn(name = "ext_product_id", referencedColumnName = "ext_product_id", nullable = false)
    private ExtProduct extProduct;

    public ClientExtProduct() {
	}

	public ClientExtProduct(Long clientId, ExtProduct extProduct) {
		this.clientId = clientId;
		this.extProduct = extProduct;
	}

	public Long getClientExtProductId() {
		return clientExtProductId;
	}

	public void setClientExtProductId(Long clientExtProductId) {
		this.clientExtProductId = clientExtProductId;
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
}
