import getYandexCheckoutToken from "@Core/api/creamly.firebase/yandex.checkout";
import * as Router from "@Core/app/router";

export default async ({ checkoutId }) => {
  if (!checkoutId) throw Error("checkout doesn't have checkoutId");

  const yandexCheckoutToken = await getYandexCheckoutToken(checkoutId);

  if (!yandexCheckoutToken) throw Error("din't get YandexCheckoutToken");

  const yandexReturnURL = Router.getOrderConfirmationURL(
    window.location.hostname,
    checkoutId
  );

  return { yandexCheckoutToken, yandexReturnURL };
};
