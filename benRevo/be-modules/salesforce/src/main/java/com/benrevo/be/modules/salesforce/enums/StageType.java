package com.benrevo.be.modules.salesforce.enums;

import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.BaseException;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Arrays.copyOf;
import static java.util.Arrays.stream;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * Created by ebrandell on 11/14/17 at 4:19 PM.
 */
public enum StageType {
    Qualification("Qualification", 10.0),
    RfpStarted("RFP Started", 10.0, ClientState.RFP_STARTED),
    RfpSubmitted("RFP Submitted", 10.0, ClientState.RFP_SUBMITTED),
    Quoted("Quoted", 25.0, ClientState.QUOTED),
    HotProspect("Hot Prospect", 75.0),
    SubmittedForApproval("Submitted for approval", 75.0, ClientState.PENDING_APPROVAL),
    Onboarding("Onboarding", 100.0, ClientState.ON_BOARDING),
    ClosedWon("Closed Won", 100.0, ClientState.COMPLETED),
    ClosedLost("Closed Lost", 0.0);

    String displayName;
    Double probability;
    ClientState [] clientStates;

    StageType(String displayName, Double probability, ClientState ... states) {
        this.displayName = displayName;
        this.probability = probability;
        this.clientStates = states;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Double getProbability() {
        return probability;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public ClientState[] getClientStates() {
        return clientStates;
    }

    public void setClientStates(ClientState[] clientStates) {
        this.clientStates = clientStates;
    }

    public static StageType fromClientState(ClientState state) {
        if(state == null) {
            return RfpStarted;
        }
        return stream(copyOf(values(), values().length))
            .filter(
                s -> stream(copyOf(s.clientStates, s.clientStates.length))
                    .anyMatch(c -> equalsAnyIgnoreCase(c.name(), state.name()))
            )
            .findAny()
            .orElseThrow(
                () -> new BaseException("No matching StageType for ClientState")
                    .withFields(
                        field("client_state", state.name())
                    )
            );
    }

    public static StageType fromName(String otherName) {
        if(isBlank(otherName)) {
            return RfpStarted;
        }
        return stream(copyOf(values(), values().length))
            .filter(s -> equalsIgnoreCase(otherName, s.getDisplayName()))
            .findAny()
            .orElseThrow(
                () -> new BaseException("No matching StageType for StageType displayName")
                    .withFields(
                        field("display_name", otherName)
                    )
            );
    }

    @Override
    public String toString() {
        return displayName;
    }
}
