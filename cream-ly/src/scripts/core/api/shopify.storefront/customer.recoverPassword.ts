import { grahqlFetch } from ".";
import gql from "graphql-tag";

export type customerUserError = {
  code: string;
  field: null | Array<string>;
  message: string;
};

export type StorefrontCustomerMutationRecoverPassword = {
  data: {
    customerRecover: {
      customerUserErrors: Array<customerUserError>;
    };
  };
  errors?: Array<any>;
};

const storefrontMutationCustomerRecover = gql`
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Sends a reset password email to the customer, as the first step in the reset password process.
 * @tutorial https://shopify.dev/docs/storefront-api/reference/customers/customerrecover
 */
export default async function create(
  email: string
): Promise<StorefrontCustomerMutationRecoverPassword> {
  return grahqlFetch(storefrontMutationCustomerRecover, { email }).then(
    (response: StorefrontCustomerMutationRecoverPassword) => {
      if (!response || response.errors) throw Error("no response from graphql");
      return response;
    }
  );
}
