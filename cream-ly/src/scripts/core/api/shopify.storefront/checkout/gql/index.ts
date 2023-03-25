import gql from "graphql-tag";

//@sources from https://github.com/Shopify/js-buy-sdk/tree/master/src/graphql

const ProductFragment = gql`
  fragment ProductFragment on Product {
    id
    availableForSale
    createdAt
    updatedAt
    descriptionHtml
    description
    handle
    productType
    title
    vendor
    publishedAt
    onlineStoreUrl
    options {
      name
      values
    }
    images(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          src
          altText
        }
      }
    }
    variants(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...VariantFragment
        }
      }
    }
  }
`;

const VariantFragment = gql`
  fragment VariantFragment on ProductVariant {
    id
    title
    price
    priceV2 {
      amount
      currencyCode
    }
    presentmentPrices(first: 20) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    weight
    available: availableForSale
    sku
    compareAtPrice
    compareAtPriceV2 {
      amount
      currencyCode
    }
    image {
      id
      src: originalSrc
      altText
    }
    selectedOptions {
      name
      value
    }
  }
`;
/* 
unitPrice {
  amount
  currencyCode
}
unitPriceMeasurement {
  measuredType
  quantityUnit
  quantityValue
  referenceUnit
  referenceValue
} */

const VariantWithProductFragment = gql`
  ${VariantFragment}
  fragment VariantWithProductFragment on ProductVariant {
    ...VariantFragment
    product {
      id
      handle
    }
  }
`;

const DiscountApplicationFragment = gql`
  fragment DiscountApplicationFragment on DiscountApplication {
    targetSelection
    allocationMethod
    targetType
    value {
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
    ... on ManualDiscountApplication {
      title
      description
    }
    ... on DiscountCodeApplication {
      code
      applicable
    }
    ... on ScriptDiscountApplication {
      description
    }
    ... on AutomaticDiscountApplication {
      title
    }
  }
`;

const AppliedGiftCardFragment = gql`
  fragment AppliedGiftCardFragment on AppliedGiftCard {
    amountUsedV2 {
      amount
      currencyCode
    }
    balanceV2 {
      amount
      currencyCode
    }
    presentmentAmountUsed {
      amount
      currencyCode
    }
    id
    lastCharacters
  }
`;

const CheckoutFragment = gql`
  fragment MailingAddressFragment on MailingAddress {
    id
    address1
    address2
    city
    company
    country
    firstName
    formatted
    lastName
    latitude
    longitude
    phone
    province
    zip
    name
    countryCode: countryCodeV2
    provinceCode
  }

  ${VariantWithProductFragment}
  ${AppliedGiftCardFragment}

  fragment CheckoutFragment on Checkout {
    id
    ready
    requiresShipping
    note
    paymentDue
    currencyCode
    paymentDueV2 {
      amount
      currencyCode
    }
    webUrl
    orderStatusUrl
    taxExempt
    taxesIncluded

    totalTax
    totalTaxV2 {
      amount
      currencyCode
    }
    lineItemsSubtotalPrice {
      amount
      currencyCode
    }
    subtotalPrice
    subtotalPriceV2 {
      amount
      currencyCode
    }
    totalPrice
    totalPriceV2 {
      amount
      currencyCode
    }
    completedAt
    createdAt
    updatedAt
    email
    discountApplications(first: 10) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          ...DiscountApplicationFragment
        }
      }
    }
    appliedGiftCards {
      ...AppliedGiftCardFragment
    }
    shippingAddress {
      ...MailingAddressFragment
    }
    shippingLine {
      handle
      price
      priceV2 {
        amount
        currencyCode
      }
      title
    }
    customAttributes {
      key
      value
    }

    lineItems(first: 250) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          title
          variant {
            ...VariantWithProductFragment
          }
          quantity

          discountAllocations {
            allocatedAmount {
              amount
              currencyCode
            }
            discountApplication {
              ...DiscountApplicationFragment
            }
          }
        }
      }
    }
  }
`;

export default gql`
  query($id: ID!) {
    node(id: $id) {
      ...CheckoutFragment
    }
  }
  ${DiscountApplicationFragment}
  ${CheckoutFragment}
`;
