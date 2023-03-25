export interface LocationData {
  countryCode: string;
  countryName: string;
  zip: string;
  region: string;
  city: string;
  currency: string;
  status: "success" | "fail";
}

declare global {
  namespace ipAPI {
    interface ILocationData extends LocationData {}
  }
}
export {};
