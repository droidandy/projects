let fulfillmentCountryCodeSingleton = "NL";

export const getFulfillmentCountryCode = (): string => {
  return fulfillmentCountryCodeSingleton;
};

export const setFulfillmentCountryCode = (
  fulfillmentCountryCode: string
): string => {
  fulfillmentCountryCodeSingleton = fulfillmentCountryCode;

  return fulfillmentCountryCodeSingleton;
};
