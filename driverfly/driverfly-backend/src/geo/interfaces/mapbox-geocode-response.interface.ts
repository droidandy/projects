export interface MapboxGeocodeResponse {
    type: string;
    query: string[];
    features: GeocodeFeature[];
    attribution: string;
}

interface GeocodeFeature {
    id: string,
    type: string,
    place_type: string[],
    relevance: number,
    properties: GeocodeFeatureProperties;
    text: string;
    place_name: string;
    center: number[];
    geometry: GeocodeFeatureGeometry;
    address: string;
    context: GeocodeFeatureContext[];
}

interface GeocodeFeatureProperties {
    accuracy: string;
}

interface GeocodeFeatureGeometry {
    type: string;
    coordinates: number[]
}

interface GeocodeFeatureContext {
    id: string;
    short_code: string;
    wikidata: string;
    text: string;
}