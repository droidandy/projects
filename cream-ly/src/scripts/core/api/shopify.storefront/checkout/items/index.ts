import gql from "graphql-tag";
import { grahqlFetch } from "../../";

const queryCheckoutCreate = gql`
  mutation checkoutLineItemsReplace(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutId: ID!
  ) {
    checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) {
      checkout {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const replaceLineItems = (lineItems: Array<any>, checkoutId: string) => {
  const variables = {
    lineItems,
    checkoutId,
  };

  return grahqlFetch(queryCheckoutCreate, variables);
};
