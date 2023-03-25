import gql from "graphql-tag";

export default gql`
  mutation checkoutShippingAddressUpdateV2(
    $shippingAddress: MailingAddressInput!
    $checkoutId: ID!
  ) {
    checkoutShippingAddressUpdateV2(
      shippingAddress: $shippingAddress
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
