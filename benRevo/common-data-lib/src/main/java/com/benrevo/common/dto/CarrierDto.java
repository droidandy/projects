package com.benrevo.common.dto;

import java.util.List;

public class CarrierDto {
    private Long carrierId;
    private String name;
    private String displayName;
    private String amBestRating;
    private String logoUrl;
    private String logoWKaiserUrl;
    private String originalImageUrl;
    private String originalImageKaiserUrl;
    private List<NetworkDto> networks;

    public CarrierDto() {
        super();
    }

    public CarrierDto(String name, String displayName) {
        this.name = name;
        this.displayName = displayName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAmBestRating() {
        return amBestRating;
    }
    
    public void setAmBestRating(String amBestRating) {
        this.amBestRating = amBestRating;
    }

    public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	public String getLogoWKaiserUrl() {
		return logoWKaiserUrl;
	}

	public void setLogoWKaiserUrl(String logoWKaiserUrl) {
		this.logoWKaiserUrl = logoWKaiserUrl;
	}

    public String getOriginalImageUrl() {
        return originalImageUrl;
    }

    public void setOriginalImageUrl(String originalImageUrl) {
        this.originalImageUrl = originalImageUrl;
    }

    public String getOriginalImageKaiserUrl() {
        return originalImageKaiserUrl;
    }

    public void setOriginalImageKaiserUrl(String originalImageKaiserUrl) {
        this.originalImageKaiserUrl = originalImageKaiserUrl;
    }
    
    public List<NetworkDto> getNetworks() {
        return networks;
    }
    
    public void setNetworks(List<NetworkDto> networks) {
        this.networks = networks;
    }
}