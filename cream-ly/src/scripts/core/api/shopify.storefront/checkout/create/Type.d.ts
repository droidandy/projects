export interface graphQLResponse {
  data: {
    checkoutCreate: {
      checkout: {
        id: string;
      };
      checkoutUserErrors: [];
    };
  };
  errors?: [];
}

declare global {
  namespace shopifyStorefront {
    interface ICheckoutCreateResponse extends graphQLResponse {}
  }
}
export {};
