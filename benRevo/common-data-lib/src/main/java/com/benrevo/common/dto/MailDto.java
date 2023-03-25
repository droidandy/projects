package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class MailDto {

    private String subject;
    private String content;
    private List<String> recipients = new ArrayList<>();
    private List<String> ccRecipients = new ArrayList<>();
    private List<String> bccRecipients = new ArrayList<>();

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }

    public String getRecipient() {
        return recipients.size() > 0 ? recipients.get(0) : null;
    }

    public void setRecipient(String recipient) {
        this.recipients = new ArrayList<>();
        recipients.add(recipient);
    }

    public List<String> getCcRecipients() {
        return ccRecipients;
    }

    public void setCcRecipients(List<String> ccRecipients) {
        this.ccRecipients = ccRecipients;
    }

    public List<String> getBccRecipients() {
        return bccRecipients;
    }

    public void setBccRecipients(List<String> bccRecipients) {
        this.bccRecipients = bccRecipients;
    }
}
