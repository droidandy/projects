export interface ForwardGeocodable {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    forwardGeocodeId?: number;
    countyId?: number;
    neighborhoodId?: number;
    latitude?: number;
    longitude?: number;
}