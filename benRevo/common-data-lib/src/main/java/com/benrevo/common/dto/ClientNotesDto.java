package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class ClientNotesDto {
    
    private String notes;

    public ClientNotesDto(String notes) {
        this.notes = notes;
    }

    public ClientNotesDto() {
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
