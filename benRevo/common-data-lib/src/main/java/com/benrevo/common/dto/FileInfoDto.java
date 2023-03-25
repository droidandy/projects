package com.benrevo.common.dto;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.EqualsBuilder;

public class FileInfoDto {

    private String name;
    private String link;
    private String type;
    private String created;
    private String section;
    private Long size;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }
	
    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof FileInfoDto)) {
            return false;
        }

        FileInfoDto that = (FileInfoDto) o;

        return new EqualsBuilder()
            .append(getName(), that.getName())
            .append(getLink(), that.getLink())
            .append(getType(), that.getType())
            .append(getCreated(), that.getCreated())
            .append(getSection(), that.getSection())
            .append(getSize(), that.getSize())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getName())
            .append(getLink())
            .append(getType())
            .append(getCreated())
            .append(getSection())
            .append(getSize())
            .toHashCode();
    }
}
