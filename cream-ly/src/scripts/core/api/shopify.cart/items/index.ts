//@ts-nocheck
import FormData from "form-data";

export function add(variantId, properties = {}, quantity = 1) {
  const url = "/cart/add.js";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const item = {
    id: variantId,
    quantity,
    properties,
  };

  const options = {
    headers,
    method: "post",
    body: JSON.stringify({ items: [item] }),
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res && res.status && res.status == "bad_request")
        throw Error("error adding product to cart" + JSON.stringify(res));
      return res;
    });
}

export function addMultipleItems(items) {
  const url = "/cart/add.js";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const options = {
    headers,
    method: "post",
    body: JSON.stringify({ items }),
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res && res.status && res.status == "bad_request")
        throw Error("error adding product to cart" + JSON.stringify(res));
      return res;
    });
}

//Expect object with key variantId and count as value
export function updateMultipleItems(keyValueList) {
  const url = "/cart/update.js";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const options = {
    headers,
    method: "post",
    body: JSON.stringify({ updates: keyValueList }),
  };

  return fetch(url, options).then((res) => res.json());
}

export function changeItemQuanity(cartLine, quantity) {
  const url = "/cart/change.js";

  const body = new FormData();
  body.append("quantity", quantity);
  body.append("line", cartLine);

  const options = {
    method: "post",
    body,
  };

  return fetch(url, options).then((res) => res.json());
}
