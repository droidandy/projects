//@ts-nocheck
import Cookies from "js-cookie";

let token = null;
export async function getToken(useSingleton = true) {
  if (useSingleton && token) return token;
  await getCart();
  return token;
}

export function getCart(): Promise<IShopifyCart> {
  const url = "/cart.js";
  return fetch(url)
    .then((res) => res.json())
    .then((cart) => {
      token = cart.token;
      return cart;
    });
}

export function clear() {
  return Cookies.remove("cart");
}
