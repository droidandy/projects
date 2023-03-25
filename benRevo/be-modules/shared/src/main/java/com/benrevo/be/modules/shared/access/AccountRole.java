package com.benrevo.be.modules.shared.access;

public enum AccountRole {

    ADMINISTRATOR("Delegated Admin - Administrator"),
    USER("Delegated Admin - User"),
    IMPLEMENTATION_MANAGER("implementation_manager"),
    BROKER("broker"),
    CLIENT("client"),
    CARRIER_MANAGER("carrier_manager"),
    CARRIER_MANAGER_RENEWAL("carrier_manager_renewal"),
    CARRIER_SALES("carrier_sales"),
    CARRIER_SALES_RENEWAL("carrier_sales_renewal"),
    CARRIER_PRESALE("carrier_presale");
	
	private String value;

	private AccountRole(String value) {
		this.value = value;
	}

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public static AccountRole of(String value) {
		for (AccountRole ar : AccountRole.values()) {
			if (ar.value.equals(value)) {
				return ar;
			}
		}
		return null;
	}
}
	
