import { baseEU } from ".";

export default async (checkoutId) => {
  const url = `${baseEU}paymentYandex-getConfirmationTokenForCheckout?checkoutId=${checkoutId}`;

  return fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return data.token;
    });
};
