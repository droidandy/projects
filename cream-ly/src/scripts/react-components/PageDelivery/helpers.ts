// @ts-nocheck
import { shipping_zones as shippingZones } from "../../core/checkout/shippingZones";

const provincesFitr = (provinces, provinceCode) =>
  provinceCode && provinces.length > 0
    ? provinces.some((province) => province.code === provinceCode)
    : true;

export const filterZonesByCountryCode = (
  countryCodes: string[],
  provinceCode: string
): void => {
  const allZonesCountries = shippingZones.flatMap(zone => {
    return zone.countries.map((item) => item.code)
  });

  const isAllCountryCodesExistsInShippingInfo = countryCodes.every(countryCode => allZonesCountries.includes(countryCode));

  // if no add rest of world zone for unknown
  const allCountryCodes = [
    ...countryCodes,
    isAllCountryCodesExistsInShippingInfo ? "" : "*"
  ];

  return shippingZones
    .filter((zone) =>
      zone.countries.some(
        (country) =>
          allCountryCodes.includes(country.code) &&
          provincesFitr(country.provinces, provinceCode)
      )
    )
    .map((zone) => ({
      ...zone,
      countries: zone.countries.filter(
        (country) => countryCodes.includes(country.code)
      ),
    }));
};

export const getDeliveryInfo = (zone) => {
  let minDeliveryCost = 0;
  let maxDeliveryCost = 0;
  let freeDeliveryAmount = 0;

  // zone.price_based_shipping_rates.forEach((item) => {
  //   const price = item.price && parseFloat(item.price);
  //   minDeliveryCost = price > minDeliveryCost ? price : minDeliveryCost;
  //   maxDeliveryCost = price > maxDeliveryCost ? price : maxDeliveryCost;
  //   freeDeliveryAmount =
  //     parseFloat(item.min_order_subtotal) > freeDeliveryAmount
  //       ? item.min_order_subtotal
  //       : freeDeliveryAmount;
  // });

  zone.price_based_shipping_rates.forEach((item) => {
    minDeliveryCost = Math.max(minDeliveryCost, item.price);
    maxDeliveryCost = Math.max(maxDeliveryCost, item.price);
    freeDeliveryAmount = Math.max(freeDeliveryAmount, item.max_order_subtotal);
  });

  return {
    minDeliveryCost,
    maxDeliveryCost,
    maxFreeDeliveryAmount: Number(freeDeliveryAmount),
  };
};

export const getDeliveryRangeInfo = (zones) => {
  let rates = [];

  const minOrderSubtotal = [];
  const maxOrderSubtotal = [];
  const price = [];

  zones.forEach((item) => {
    rates = rates.concat(item.price_based_shipping_rates);
  });

  const isValid = (item) => item && parseFloat(item) > 0;

  rates.forEach((item) => {
    if (isValid(item.min_order_subtotal)) {
      minOrderSubtotal.push(item.min_order_subtotal);
    }
    if (isValid(item.max_order_subtotal)) {
      maxOrderSubtotal.push(item.max_order_subtotal);
    }
    if (isValid(item.price)) price.push(item.price);
  });

  return {
    minDeliveryCost: price.length ? Math.min(...price) : 0,
    maxDeliveryCost: price.length ? Math.max(...price) : 0,
    minFreeDeliveryAmount: minOrderSubtotal.length
      ? Math.min(...minOrderSubtotal)
      : 0,
    maxFreeDeliveryAmount: maxOrderSubtotal.length
      ? Math.max(...maxOrderSubtotal)
      : 0
  };
};

export const setDefaultDeliveryInfo = () => {
  const zone = shippingZones.find((item) => item.name === "Rest of world");
  return getDeliveryInfo(zone);
};

export const defaultDeliveryInfo = setDefaultDeliveryInfo();
