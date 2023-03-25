package com.benrevo.data.persistence.entities;

import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "presentation_option")
public class PresentationOption {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column	(name = "presentation_option_id")
	private Long presentationOptionId;

    @Column (name = "name")
    private String name;

    @OneToOne
    @JoinColumn(name="client_id", referencedColumnName="client_id", nullable=false)
    private Client client;

    @OneToOne
    @JoinColumn(name="medical_rfp_quote_option_id", referencedColumnName="rfp_quote_option_id")
    private RfpQuoteOption medicalRfpQuoteOption;

    @OneToOne
    @JoinColumn(name="dental_rfp_quote_option_id", referencedColumnName="rfp_quote_option_id")
    private RfpQuoteOption dentalRfpQuoteOption;

    @OneToOne
    @JoinColumn(name="vision_rfp_quote_option_id", referencedColumnName="rfp_quote_option_id")
    private RfpQuoteOption visionRfpQuoteOption;

    @OneToOne
    @JoinColumn(name="life_rfp_quote_ancillary_option_id", referencedColumnName="rfp_quote_ancillary_option_id")
    private RfpQuoteAncillaryOption lifeRfpQuoteAncillaryOption;

    @OneToOne
    @JoinColumn(name="std_rfp_quote_ancillary_option_id", referencedColumnName="rfp_quote_ancillary_option_id")
    private RfpQuoteAncillaryOption stdRfpQuoteAncillaryOption;

    @OneToOne
    @JoinColumn(name="ltd_rfp_quote_ancillary_option_id", referencedColumnName="rfp_quote_ancillary_option_id")
    private RfpQuoteAncillaryOption ltdRfpQuoteAncillaryOption;

    @Column (name = "dental_discount")
    private Float dentalDiscountPercent;

    @Column (name = "vision_discount")
    private Float visionDiscountPercent;

    @Column (name = "life_discount")
    private Float lifeDiscountPercent;

    @Column (name = "std_discount")
    private Float stdDiscountPercent;

    @Column (name = "ltd_discount")
    private Float ltdDiscountPercent;

    public Long getPresentationOptionId() {
        return presentationOptionId;
    }

    public void setPresentationOptionId(Long presentationOptionId) {
        this.presentationOptionId = presentationOptionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public RfpQuoteOption getMedicalRfpQuoteOption() {
        return medicalRfpQuoteOption;
    }

    public void setMedicalRfpQuoteOption(
        RfpQuoteOption medicalRfpQuoteOption) {
        this.medicalRfpQuoteOption = medicalRfpQuoteOption;
    }

    public RfpQuoteOption getDentalRfpQuoteOption() {
        return dentalRfpQuoteOption;
    }

    public void setDentalRfpQuoteOption(
        RfpQuoteOption dentalRfpQuoteOption) {
        this.dentalRfpQuoteOption = dentalRfpQuoteOption;
    }

    public RfpQuoteOption getVisionRfpQuoteOption() {
        return visionRfpQuoteOption;
    }

    public void setVisionRfpQuoteOption(
        RfpQuoteOption visionRfpQuoteOption) {
        this.visionRfpQuoteOption = visionRfpQuoteOption;
    }

    public RfpQuoteAncillaryOption getLifeRfpQuoteAncillaryOption() {
        return lifeRfpQuoteAncillaryOption;
    }

    public void setLifeRfpQuoteAncillaryOption(
        RfpQuoteAncillaryOption lifeRfpQuoteAncillaryOption) {
        this.lifeRfpQuoteAncillaryOption = lifeRfpQuoteAncillaryOption;
    }

    public RfpQuoteAncillaryOption getStdRfpQuoteAncillaryOption() {
        return stdRfpQuoteAncillaryOption;
    }

    public void setStdRfpQuoteAncillaryOption(
        RfpQuoteAncillaryOption stdRfpQuoteAncillaryOption) {
        this.stdRfpQuoteAncillaryOption = stdRfpQuoteAncillaryOption;
    }

    public RfpQuoteAncillaryOption getLtdRfpQuoteAncillaryOption() {
        return ltdRfpQuoteAncillaryOption;
    }

    public void setLtdRfpQuoteAncillaryOption(
        RfpQuoteAncillaryOption ltdRfpQuoteAncillaryOption) {
        this.ltdRfpQuoteAncillaryOption = ltdRfpQuoteAncillaryOption;
    }

    public Float getDentalDiscountPercent() {
        return dentalDiscountPercent;
    }

    public void setDentalDiscountPercent(Float dentalDiscountPercent) {
        this.dentalDiscountPercent = dentalDiscountPercent;
    }

    public Float getVisionDiscountPercent() {
        return visionDiscountPercent;
    }

    public void setVisionDiscountPercent(Float visionDiscountPercent) {
        this.visionDiscountPercent = visionDiscountPercent;
    }

    public Float getLifeDiscountPercent() {
        return lifeDiscountPercent;
    }

    public void setLifeDiscountPercent(Float lifeDiscountPercent) {
        this.lifeDiscountPercent = lifeDiscountPercent;
    }

    public Float getStdDiscountPercent() {
        return stdDiscountPercent;
    }

    public void setStdDiscountPercent(Float stdDiscountPercent) {
        this.stdDiscountPercent = stdDiscountPercent;
    }

    public Float getLtdDiscountPercent() {
        return ltdDiscountPercent;
    }

    public void setLtdDiscountPercent(Float ltdDiscountPercent) {
        this.ltdDiscountPercent = ltdDiscountPercent;
    }
}
