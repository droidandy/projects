package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class RelationDto {

    private Long id;
    @NotNull
    private Long parentId;
    @NotNull
    private Long childId;

    public RelationDto() {}
    
    public RelationDto(Long parentId, Long childId) {
        this.parentId = parentId;
        this.childId = childId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getChildId() {
        return childId;
    }

    public void setChildId(Long childId) {
        this.childId = childId;
    }
    
}