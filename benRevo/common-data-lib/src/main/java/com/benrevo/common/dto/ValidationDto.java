package com.benrevo.common.dto;

import com.benrevo.common.enums.ClientDetailsStatus;

public class ValidationDto {

    private ClientDetailsStatus client = ClientDetailsStatus.READY;
    private ClientDetailsStatus rfp = ClientDetailsStatus.NOT_STARTED;
    private ClientDetailsStatus presentation = ClientDetailsStatus.NOT_STARTED;


    public ClientDetailsStatus getClient() {
        return client;
    }

    public void setClient(ClientDetailsStatus client) {
        this.client = client;
    }

    public ClientDetailsStatus getRfp() {
        return rfp;
    }

    public void setRfp(ClientDetailsStatus rfp) {
        this.rfp = rfp;
    }

    public ClientDetailsStatus getPresentation() {
        return presentation;
    }

    public void setPresentation(ClientDetailsStatus presentation) {
        this.presentation = presentation;
    }
}
