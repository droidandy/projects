export default interface Checkout {
  id: string;
  numericId?: number;

  isPaid: boolean;
  webUrl: null | string;
  requiresShipping: boolean;

  discountInPresentmentCurrency: number;
  itemsCostInEUR: number;
  shippingCostInEUR: number;

  items: [{ quantity }];

  note: null | string;
  email: null | string;
  shippingAddress: Object;

  attributes: {
    skinType: null | string;
    skinGoals: Array<string>;
    videoGoals: Array<string>;
  };
}

declare global {
  interface ICheckout extends Checkout {}
}
