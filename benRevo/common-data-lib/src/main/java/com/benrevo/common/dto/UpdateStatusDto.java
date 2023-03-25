package com.benrevo.common.dto;

import com.benrevo.common.enums.ClientState;

public class UpdateStatusDto {
    private ClientState clientState;

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }
}