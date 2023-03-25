import { grahqlFetch } from ".";
import gql from "graphql-tag";

export type customerUserError = {
  code: string;
  field: null | Array<string>;
  message: string;
};

export type StorefrontCustomerMutationCreateResponse = {
  data: {
    customerCreate: {
      customer: null | {
        id: string;
      };
      customerUserErrors: Array<customerUserError>;
    };
  };
  errors?: Array<any>;
};

export type StorefrontCustomerMutationCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
};

const storefrontMutationCustomerCreate = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * @tutorial https://shopify.dev/docs/storefront-api/reference/customers/customercreate
 */
export async function create(
  input: StorefrontCustomerMutationCreateInput
): Promise<StorefrontCustomerMutationCreateResponse> {
  inputFieldsValidation(input);

  return grahqlFetch(storefrontMutationCustomerCreate, { input }).then(
    (response: StorefrontCustomerMutationCreateResponse) => {
      if (!response || response.errors) throw Error("no response from graphql");
      return response;
    }
  );
}

export const inputFieldsValidation = (
  input: StorefrontCustomerMutationCreateInput
) => {
  const ALLOWED_INPUT = [
    "email",
    "password",
    "acceptsMarketing",
    "firstName",
    "lastName",
    "phone",
  ];

  Object.keys(input).map((key) => {
    if (!ALLOWED_INPUT.includes(key)) throw Error("input has wrong key " + key);
  });
};
