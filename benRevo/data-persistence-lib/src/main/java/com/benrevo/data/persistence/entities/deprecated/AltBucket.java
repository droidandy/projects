package com.benrevo.data.persistence.entities.deprecated;

import com.benrevo.common.dto.deprecated.AltBucketDto;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.dto.deprecated.AltBucketDto;

//@Entity
//@Table(name = "alt_bucket")
public class AltBucket {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "alt_bucket_id")
	private Long altBucketId;
	
	@Column (name = "client_id")
	private Long clientId;
	
	@Column (name = "category")
	private String category;
	
	@Column (name = "plan_type")
	private String planType;
	
	@Column (name = "name")
	private String name;
	
	@Column (name = "contribution_tier1")
	private Long contributionTier1;
	
	@Column (name = "contribution_tier2")
	private Long contributionTier2;
	
	@Column (name = "contribution_tier3")
	private Long contributionTier3;
	
	@Column (name = "contribution_tier4")
	private Long contributionTier4;
	
	@Column (name = "visited")
	private Date visited;
	
	@Column (name = "custom_name")
	private String customName;

	public AltBucket() { }
	
	public AltBucket(Long clientId, String category, String planType, String name, Long tier1, Long tier2, Long tier3, Long tier4) {
		this.clientId = clientId;
		this.category = category;
		this.planType = planType;
		this.name = name;
		this.contributionTier1 = tier1;
		this.contributionTier2 = tier2;
		this.contributionTier3 = tier3;
		this.contributionTier4 = tier4;
	}

	public Long getAltBucketId() {
		return altBucketId;
	}

	public void setAltBucketId(Long altBucketId) {
		this.altBucketId = altBucketId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getContributionTier1() {
		return contributionTier1;
	}

	public void setContributionTier1(Long contributionTier1) {
		this.contributionTier1 = contributionTier1;
	}

	public Long getContributionTier2() {
		return contributionTier2;
	}

	public void setContributionTier2(Long contributionTier2) {
		this.contributionTier2 = contributionTier2;
	}

	public Long getContributionTier3() {
		return contributionTier3;
	}

	public void setContributionTier3(Long contributionTier3) {
		this.contributionTier3 = contributionTier3;
	}

	public Long getContributionTier4() {
		return contributionTier4;
	}

	public void setContributionTier4(Long contributionTier4) {
		this.contributionTier4 = contributionTier4;
	}

	public Date getVisited() {
		return visited;
	}

	public void setVisited(Date visited) {
		this.visited = visited;
	}

	public String getCustomName() {
		return customName;
	}

	public void setCustomName(String customName) {
		this.customName = customName;
	}

	public AltBucketDto toAltBucketDto() {
		AltBucketDto dto = new AltBucketDto();
		dto.setId(altBucketId);
		dto.setClientId(clientId);
		dto.setCategory(category);
		dto.setName(name);
		dto.setPlanType(planType);
		dto.setContributionTier1(contributionTier1);
		dto.setContributionTier2(contributionTier2);
		dto.setContributionTier3(contributionTier3);
		dto.setContributionTier4(contributionTier4);
		dto.setVisited(new java.sql.Timestamp(visited.getTime()));
		dto.setCustomName(customName);
		return dto;
	}
}
