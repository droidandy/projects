package com.benrevo.common.dto;

import java.util.Date;

public class BenefitDto {
    private Long id;
    private String name;
    private String inOutNetwork;
    private String value;
    private String format;
    private String restriction;
    private Date created;
    private Date updated;

    public BenefitDto() {
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInOutNetwork() {
		return inOutNetwork;
	}

	public void setInOutNetwork(String inOutNetwork) {
		this.inOutNetwork = inOutNetwork;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

    public String getRestriction() {
        return restriction;
    }

    public void setRestriction(String restriction) {
        this.restriction = restriction;
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
}
