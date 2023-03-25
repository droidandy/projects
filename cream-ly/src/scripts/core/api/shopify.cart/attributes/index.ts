//@ts-nocheck

import { getCart } from "..";
import FormData from "form-data";

export async function setAttributeVideoGoals(goals) {
  return setAttributes({ videoGoals: JSON.stringify(goals) });
}

export function setNote(note) {
  const url = "/cart/update.js";

  const options = {
    method: "post",
    body: createFormData(note),
  };

  return fetch(url, options).then((res) => res.json());
}

function createFormData(note: string | null) {
  const formData = new FormData();
  formData.append("note", note && note != "null" ? note : "");
  return formData;
}

export function setAttributes(attributesObject) {
  const url = "/cart/update.js";

  const options = {
    method: "post",
    body: attributesToFormData(attributesObject),
  };

  return fetch(url, options).then((res) => res.json());
}

export function setAttributesAndNote(attributesObject, note) {
  const url = "/cart/update.js";

  const options = {
    method: "post",
    body: attributesToFormData(attributesObject, note),
  };

  return fetch(url, options).then((res) => res.json());
}

export function setShopifyCartLanguageIfNeeded(newLang) {
  if (!["ru", "en"].includes(newLang)) return;

  return getCart().then((cart) => {
    if (cart.attributes.language != newLang)
      return setAttributes({ language: newLang });
  });
}

export function attributesToFormData(
  attributesObject: object,
  note: string | null
) {
  const form = createFormData(note);
  if (typeof attributesObject !== "object") return form;

  Object.keys(attributesObject).forEach((key) => {
    const name = "attributes[" + key + "]";
    const value = Array.isArray(attributesObject[key])
      ? JSON.stringify(attributesObject[key])
      : attributesObject[key];

    if (value !== null) form.append(name, value);
  });

  return form;
}
