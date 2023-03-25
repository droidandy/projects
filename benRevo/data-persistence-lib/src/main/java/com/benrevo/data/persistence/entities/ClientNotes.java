package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "client_notes")
public class ClientNotes {
    
    @Id
    @Column(name = "client_notes_id", insertable = false, nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientNotesId;

    @OneToOne
    @JoinColumn(name="client_id", referencedColumnName="client_id", nullable=false)
    private Client client;

    @Column (name = "notes")
    private String notes;

    @Column (name = "updated")
    private Date updated;

    public Long getClientNotesId() {
        return clientNotesId;
    }

    public void setClientNotesId(Long clientNotesId) {
        this.clientNotesId = clientNotesId;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    
}
