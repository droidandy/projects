package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.EmailType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "recipient")
public class Recipient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipient_id")
    private Long recipientId;

    @Column(name = "email_type")
    @Enumerated(EnumType.STRING)
    private EmailType emailType;
    
    @Column(name = "recipient_type")
    private String recipientType; // see the javax.mail.Message.RecipientType: 
    
    @Column(name = "email")
    private String email;

    @Column(name = "active")
    private boolean active;
    
    @Column(name = "carrier_id")
    private Long carrierId;
    
    public Long getRecipientId() {
        return recipientId;
    }
    
    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public EmailType getEmailType() {
        return emailType;
    }
    
    public void setEmailType(EmailType emailType) {
        this.emailType = emailType;
    }

    public String getRecipientType() {
        return recipientType;
    }
    
    public void setRecipientType(String recipientType) {
        this.recipientType = recipientType;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
    
    public Long getCarrierId() {
        return carrierId;
    }
    
    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }
}
