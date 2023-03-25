package com.benrevo.common.dto;

import java.util.Objects;

public class NetworkDto {

    private Long networkId;
    private String name;
    private String type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

	public Long getNetworkId() {
		return networkId;
	}

	public void setNetworkId(Long networkId) {
		this.networkId = networkId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
    @Override
    public int hashCode() {
        return Objects.hash(networkId, name, type);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof NetworkDto)) {
            return false;
        }
        NetworkDto other = (NetworkDto) obj;

        return Objects.equals(networkId, other.networkId) 
            && Objects.equals(name, other.name) 
            && Objects.equals(type, other.type);
    }
}
