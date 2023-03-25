package com.benrevo.common.dto.ancillary;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "javaclass")
@JsonSubTypes({
		@JsonSubTypes.Type(value = LtdClassDto.class),
		@JsonSubTypes.Type(value = LifeClassDto.class),
		@JsonSubTypes.Type(value = StdClassDto.class)
})
@XmlAccessorType(XmlAccessType.FIELD)
public abstract class AncillaryClassDto {
    @XmlTransient
	private Long ancillaryClassId;

	private String name;

	public AncillaryClassDto() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
    
    public Long getAncillaryClassId() {
        return ancillaryClassId;
    }
    
    public void setAncillaryClassId(Long ancillaryClassId) {
        this.ancillaryClassId = ancillaryClassId;
    }
}
