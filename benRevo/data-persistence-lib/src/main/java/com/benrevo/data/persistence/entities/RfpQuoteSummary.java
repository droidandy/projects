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
@Table(name = "rfp_quote_summary")
public class RfpQuoteSummary {
    @Id
    @Column(name = "id", insertable = false, nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="client_id", referencedColumnName="client_id", nullable=false)
    private Client client;

    @Column (name = "medical_notes")
    private String medicalNotes;

    @Column (name = "medical_with_kaiser_notes")
    private String medicalWithKaiserNotes;

    @Column (name = "dental_notes")
    private String dentalNotes;

    @Column (name = "vision_notes")
    private String visionNotes;

    @Column (name = "life_notes")
    private String lifeNotes;

    @Column (name = "updated")
    private Date updated;

    @Column (name = "s3_key")
    private String s3Key;

    @Column (name = "file_updated")
    private Date fileUpdated;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public void setMedicalNotes(String medicalNotes) {
        this.medicalNotes = medicalNotes;
    }

    public String getDentalNotes() {
        return dentalNotes;
    }

    public void setDentalNotes(String dentalNotes) {
        this.dentalNotes = dentalNotes;
    }

    public String getVisionNotes() {
        return visionNotes;
    }

    public void setVisionNotes(String visionNotes) {
        this.visionNotes = visionNotes;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public String getMedicalWithKaiserNotes() {
        return medicalWithKaiserNotes;
    }

    public void setMedicalWithKaiserNotes(String medicalWithKaiserNotes) {
        this.medicalWithKaiserNotes = medicalWithKaiserNotes;
    }

    public String getLifeNotes() {
        return lifeNotes;
    }

    public void setLifeNotes(String lifeNotes) {
        this.lifeNotes = lifeNotes;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public Date getFileUpdated() {
        return fileUpdated;
    }

    public void setFileUpdated(Date fileUpdated) {
        this.fileUpdated = fileUpdated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RfpQuoteSummary)) return false;

        RfpQuoteSummary that = (RfpQuoteSummary) o;

        if (dentalNotes != null ? !dentalNotes.equals(that.dentalNotes) : that.dentalNotes != null) return false;
        if (!id.equals(that.id)) return false;
        if (medicalNotes != null ? !medicalNotes.equals(that.medicalNotes) : that.medicalNotes != null) return false;
        if (medicalWithKaiserNotes != null ? !medicalWithKaiserNotes.equals(that.medicalWithKaiserNotes) : that.medicalWithKaiserNotes != null) return false;
        if (!client.equals(that.client)) return false;
        if (visionNotes != null ? !visionNotes.equals(that.visionNotes) : that.visionNotes != null) return false;
        if (updated != null ? !updated.equals(that.updated) : that.updated != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + client.hashCode();
        result = 31 * result + (medicalNotes != null ? medicalNotes.hashCode() : 0);
        result = 31 * result + (medicalWithKaiserNotes != null ? medicalWithKaiserNotes.hashCode() : 0);
        result = 31 * result + (dentalNotes != null ? dentalNotes.hashCode() : 0);
        result = 31 * result + (visionNotes != null ? visionNotes.hashCode() : 0);
        result = 31 * result + (updated != null ? updated.hashCode() : 0);
        return result;
    }
}
