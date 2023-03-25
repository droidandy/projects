package com.benrevo.data.persistence.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "benefit_name")
public class BenefitName {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "benefit_name_id")
	private Long benefitNameId;
	
	@Column (name = "name")
	private String name;

	@Column (name = "display_name")
	private String displayName;
	
	@Column (name = "ordinal")
	private Integer ordinal;

	@Column (name = "created")
	private Date created;
	
	@Column (name = "updated")
	private Date updated;

	@Column (name = "highlight_type")
	private String highlightType;

	public Long getBenefitNameId() {
		return benefitNameId;
	}

	public void setBenefitNameId(Long benefitNameId) {
		this.benefitNameId = benefitNameId;
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

	public Integer getOrdinal() {
		return ordinal;
	}

	public void setOrdinal(Integer ordinal) {
		this.ordinal = ordinal;
	}

	public String getHighlightType() {
		return highlightType;
	}

	public void setHighlightType(String highlightType) {
		this.highlightType = highlightType;
	}

}
