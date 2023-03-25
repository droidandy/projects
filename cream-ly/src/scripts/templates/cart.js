/* import * as ShopifyCart from "@Core/api/shopify.cart";
import { getAllUrlParams } from "@Core/url";

async function showPaymentError() {
  const params = getAllUrlParams();
  if (!params.paymenterror || params.token != (await ShopifyCart.getToken()))
    return;

  const error = document.createElement("div");
  error.classList.add("error");
  error.innerHTML =
    "Произошла ошибка платежа<br>Повторите попытку или свяжитесь с нами";

  document
    .querySelector("#alternative_checkout_container .section-header")
    .append(error);
}

showPaymentError();
 */
