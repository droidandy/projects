package com.benrevo.common.params.rfp;

import java.sql.Timestamp;

public class RFPSendCarrierParams {
    private long id;
    private String name;
    private String category;
    private boolean sent;
    private boolean inCarrier;
    private boolean quoted;
    private boolean declined;
    private Timestamp created;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isSent() {
        return sent;
    }

    public void setSent(boolean sent) {
        this.sent = sent;
    }

    public boolean isQuoted() {
        return quoted;
    }

    public void setQuoted(boolean quoted) {
        this.quoted = quoted;
    }

    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public boolean isInCarrier() {
        return inCarrier;
    }

    public void setInCarrier(boolean atCarrier) {
        this.inCarrier = atCarrier;
    }

    public boolean isDeclined() {
        return declined;
    }

    public void setDeclined(boolean declined) {
        this.declined = declined;
    }
}
