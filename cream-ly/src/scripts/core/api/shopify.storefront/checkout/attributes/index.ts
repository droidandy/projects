//@ts-nocheck
import { grahqlFetch } from "../..";
import { fetch as fetchCheckout } from "..";
import mutationUpdateAttributes from "../gql/updateAttributes";

import { IStorefrontCheckout } from "../types/Type.IShopifyStorefrontCheckoutResponse";

export function fetchAttributes(checkoutId: string) {
  return fetchCheckout(checkoutId).then((checkout: IStorefrontCheckout) =>
    attributesList2Object(checkout.customAttributes)
  );
}

export function updateNote(checkoutId: string, note: string) {
  return grahqlFetch(mutationUpdateAttributes, {
    checkoutId,
    input: { note },
  });
}

interface KeyValuePair {
  key: string;
  value: string;
}

export function attributesList2Object(attributesList: KeyValuePair[]): Object {
  if (!Array.isArray(attributesList))
    throw Error(
      "attributesList is not array " + JSON.stringify(attributesList)
    );

  return attributesList.reduce((obj, attribute) => {
    try {
      obj[attribute.key] = JSON.parse(attribute.value);
    } catch {
      obj[attribute.key] = attribute.value;
    }
    return obj;
  }, {});
}

// documentation https://shopify.dev/docs/storefront-api/reference/mutation/checkoutattributesupdatev2?api[version]=2020-04
export function replaceAllAttributes(checkoutId, attributesObject) {
  const attributesList = Object.keys(attributesObject).map((key) => ({
    key,
    value: Array.isArray(attributesObject[key])
      ? JSON.stringify(attributesObject[key])
      : String(attributesObject[key]),
  }));

  return grahqlFetch(mutationUpdateAttributes, {
    checkoutId,
    input: { customAttributes: attributesList },
  });
}

export function updateSomeAttributes(checkoutId, attributesObject) {
  return fetchAttributes(checkoutId).then((allAttributesObject) => {
    return replaceAllAttributes(checkoutId, {
      ...allAttributesObject,
      ...attributesObject,
    });
  });
}

export function setAttribute(checkoutId, attributeName, attributeValue) {
  return fetchAttributes(checkoutId).then((allAttributesObject) => {
    return replaceAllAttributes(checkoutId, {
      ...allAttributesObject,
      [attributeName]: attributeValue,
    });
  });
}
