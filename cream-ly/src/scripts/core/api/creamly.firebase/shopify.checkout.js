import { baseUS } from ".";

export async function checkoutCreate(token, currencyCode = "EUR") {
  const url = `${baseUS}shopifyCheckout-create?cartToken=${token}&currencyCode=${currencyCode}`;
  return fetch(url).then((res) => res.json());
}

export async function checkoutUpdateEmail(token, storefrontCheckoutId, email) {
  const url = new URL(baseUS);
  url.pathname = "shopifyCheckout-updateEmail";
  url.searchParams.set("cartToken", token);
  url.searchParams.set("storefrontCheckoutId", storefrontCheckoutId);
  url.searchParams.set("email", email);

  //console.log("checkoutUpdateEmail", url.toString());

  return fetch(url.toString()).then((res) => res.json());
}
