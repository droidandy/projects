const projectId = "cream-ly";
const regionEU = "europe-west1";
const regionUS = "us-central1";
export const baseEU = `https://${regionEU}-${projectId}.cloudfunctions.net/`;
export const baseUS = `https://${regionUS}-${projectId}.cloudfunctions.net/`;

export async function checkOrderURLForCartToken(token) {
  const url = baseUS + "shopifyCheckout-getStatus?token=" + token;

  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.paymentStatus == true) return res.url;
    });
}

export async function checkoutCreate(token, currencyCode = "EUR") {
  const url = `${baseUS}shopifyCheckout-create?cartToken=${token}&currencyCode=${currencyCode}`;
  return fetch(url).then((res) => res.json());
}

export async function getOutOfStockData() {
  const url = `${baseUS}shopifyProducts-outOfStock`;
  return fetch(url).then((res) => res.json());
}

export async function getShippingZones() {
  const url = `${baseUS}shopify-shippingZones`;
  return fetch(url).then((res) => res.json());
}
