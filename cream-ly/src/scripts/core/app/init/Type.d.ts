interface EntryPointProps {
  shopifyThemeName: string;
  locale: {
    currentLanguageCode: string;
    currentLocaleRoot: string;
    browserLanguageCodes: string[];
    currency: Currency;
  };
  urlData: URLData;
  customer: object;
}
interface URLData {
  hostname: string;
  href: string;
  path: string;
  search: string;
}

interface Currency {
  isoCode: string;
  format: string;
  exchangeEUR: number;
  exchangeBYN: number;
}

interface Location {
  countryCode: string;
  countryName?: string;
  zip?: string;
  region?: string;
  city?: string;
  currency?: string;
  status: "success" | "fail";
}

declare global {
  namespace app {
    interface IEntryPointProps extends EntryPointProps {}
    interface IURLData extends URLData {}
    interface ICurrencyData extends Currency {}
    interface ILocation extends Location {}
  }
}
export {};
