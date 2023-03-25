package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ext_product")
public class ExtProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ext_product_id")
    private Long extProductId;

    @Column (name = "name")
    private String name;

    @Column (name = "display_name")
    private String displayName;

	private ExtProduct() {
	}

	public Long getExtProductId() {
		return extProductId;
	}

	public void setExtProductId(Long extProductId) {
		this.extProductId = extProductId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
}
