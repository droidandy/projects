import * as StorefrontCustomer from "@Core/api/shopify.storefront/customer";

export default async (props, lang = "ru") => {
  return StorefrontCustomer.create({ ...props, acceptsMarketing: true })
    .then((response) => {
      if (!response || !response.data)
        throw "Storefront Customer Create response is incorect";

      //lang set for customer via storefront tags
      return response;
    })
    .then(selectErrorsFromResponse);
};

const selectErrorsFromResponse = (
  response: StorefrontCustomer.StorefrontCustomerMutationCreateResponse
) => {
  console.log("selectErrorsFromResponse", response);
  return response &&
    response.data &&
    response.data.customerCreate &&
    Array.isArray(response.data.customerCreate.customerUserErrors)
    ? response.data.customerCreate.customerUserErrors
    : [];
};
