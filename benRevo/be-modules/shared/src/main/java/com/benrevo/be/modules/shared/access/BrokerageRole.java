package com.benrevo.be.modules.shared.access;

public enum BrokerageRole {

    SUPERADMIN("superadmin"),
    ADMIN("admin"),
    USER("user"),
    CLIENT("client"),
    FULL_CLIENT_ACCESS("full_client_access");
	
	private String value;

	private BrokerageRole(String value) {
		this.value = value;
	}

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public static BrokerageRole of(String value) {
		for (BrokerageRole ar : BrokerageRole.values()) {
			if (ar.value.equals(value)) {
				return ar;
			}
		}
		return null;
	}
}
	
