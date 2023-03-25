import gql from "graphql-tag";
import { grahqlFetch } from "../../";

const queryCheckoutCreate = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export default (currencyCode = "EUR", email = null) => {
  const variables = {
    input: {
      allowPartialAddresses: true,
      presentmentCurrencyCode: currencyCode,
    },
  };

  //@ts-ignore
  if (email) variables.input.email = email;

  return grahqlFetch(queryCheckoutCreate, variables)
    .then(validateCreateResponse)
    .then(extractIdFromResponse);
};

export const extractIdFromResponse = (
  response: shopifyStorefront.ICheckoutCreateResponse
) => {
  const id = response.data.checkoutCreate.checkout.id;
  return id;
};

export function validateCreateResponse(
  response: shopifyStorefront.ICheckoutCreateResponse
) {
  if (
    !response ||
    response.errors ||
    response.data.checkoutCreate.checkout === null ||
    !response.data.checkoutCreate.checkout.id ||
    response.data.checkoutCreate.checkoutUserErrors.length > 0
  )
    throw Error(
      "Storefront Checkout is not created " + JSON.stringify(response)
    );

  return response;
}
