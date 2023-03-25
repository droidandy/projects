package com.benrevo.be.modules.salesforce.event;

import com.benrevo.be.modules.salesforce.dto.SFBase;

/**
 * Created by ebrandell on 11/9/17 at 1:04 PM.
 */
public class SalesforceEvent {

    SFBase object;
    String email;

    public SalesforceEvent() {}

    private SalesforceEvent(Builder builder) {
        setObject(builder.object);
        setEmail(builder.email);
    }

    public SFBase getObject() {
        return object;
    }

    public void setObject(SFBase object) {
        this.object = object;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static final class Builder {

        private SFBase object;
        private String email;

        public Builder() {}

        public Builder withObject(SFBase val) {
            object = val;
            return this;
        }

        public Builder withEmail(String val) {
            email = val;
            return this;
        }

        public SalesforceEvent build() {
            return new SalesforceEvent(this);
        }
    }
}
