import gql from "graphql-tag";
import { grahqlFetch } from "../../";

const QUERY_APPLY_DISCOUNT = gql`
  mutation checkoutDiscountCodeApplyV2(
    $discountCode: String!
    $checkoutId: ID!
  ) {
    checkoutDiscountCodeApplyV2(
      discountCode: $discountCode
      checkoutId: $checkoutId
    ) {
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
export const apply = (discountCode, checkoutId) => {
  const variables = {
    discountCode,
    checkoutId,
  };

  return grahqlFetch(QUERY_APPLY_DISCOUNT, variables);
};
