const selectCountryZones = (countryCode, provinceCode = null) => {
  const zones = require("./shippingZones").shipping_zones;
  const countryZones = zones
    .filter(
      (zone) =>
        zone.countries.filter((country) => country.code == countryCode).length
    )
    .map(normalizeShippingZoneRates);

  if (countryZones.length == 1) return countryZones.shift();

  if (provinceCode == null) {
    //    throw Error("regionCode is missing to filter country shipping zones");
    return null;
  }

  const regionZones = countryZones.filter(
    (zone) =>
      zone.countries.filter(
        (country) =>
          country.provinces.filter((province) => province.code == provinceCode)
            .length
      ).length
  );

  if (regionZones.length == 1) return regionZones.shift();

  throw Error(
    `more than one shipping zone is filtered for ${countryCode} ${provinceCode}`
  );
};

/*
set text prices as numbers
*/
function normalizeShippingZoneRates(zone) {
  const rates = zone.price_based_shipping_rates.map((rate) => ({
    ...rate,
    price: parseFloat(rate.price),
    min_order_subtotal: rate.min_order_subtotal
      ? parseFloat(rate.min_order_subtotal)
      : 0,
    max_order_subtotal: rate.max_order_subtotal
      ? parseFloat(rate.max_order_subtotal)
      : 0,
  }));

  return { ...zone, price_based_shipping_rates: rates };
}

export function getShippingZoneBasedOnAddress(address) {
  const countryCode = address.countryCode;
  const provinceCode = countryCode == "RU" ? address.provinceCode : null;

  return selectCountryZones(countryCode, provinceCode);
}

export function getRatesForShippingZone(shippingZone, amountInEUR) {
  if (!shippingZone || !shippingZone.price_based_shipping_rates) return [];
  //throw Error("wrong shipping zone object");

  let rates = shippingZone.price_based_shipping_rates;

  const filteredRates = rates.filter((rate) => {
    const isValid =
      rate.max_order_subtotal == 0
        ? amountInEUR >= rate.min_order_subtotal
        : amountInEUR >= rate.min_order_subtotal &&
          amountInEUR < rate.max_order_subtotal;
    return isValid;
  });

  return filteredRates;
}

export function getRatePriceAndHandleForShippingZone(
  shippingZone,
  amountInEUR
) {
  const rate = getRatesForShippingZone(shippingZone, amountInEUR).shift();

  return rate
    ? {
        price: rate.price,
        handle: getShippingRateHandle({
          price: rate.price,
          name: rate.name,
        }),
      }
    : null;
}

export default function(address, amountInEUR = 0) {
  if (!address || !address.countryCode) return null;

  const zone = getShippingZoneBasedOnAddress(address);
  return getRatePriceAndHandleForShippingZone(zone, amountInEUR);
}

/*
 * ShippingRateHandle - a unique identifier to a Checkout’s shipping provider, price, and title combination, enabling the customer to select the availableShippingRates.
 * https://shopify.dev/docs/storefront-api/reference/mutation/checkoutshippinglineupdate
 */
export const getShippingRateHandle = ({ name, price }) => {
  /* 
  const shippingRate = {
    name:
      "доставка курьером или почтовой службой с трекинг-номером (5-10 раб дней)",
    price: "6.00",
  }; */

  return `shopify-${name}-${Number(price).toFixed(2)}`;
};
