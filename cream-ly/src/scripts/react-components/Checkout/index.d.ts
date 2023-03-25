import ICartItem from "@Core/checkout/types/Type.CartItem";

export {};

declare global {
  interface IShippingAddress {
    address1: string;
    address2: string;
    city: string;
    company: string;
    firstName: string;
    lastName: string;
    phone: string;
    provinceCode: string;
    zip: string;
  }

  interface ICheckoutState {
    //shipping related
    defaultCountryCode: string;
    regionCode: string;

    email: string;
    note: string;
    shippingAddress: IShippingAddress;
    customer: object;

    shippingRateHandle: string;

    items: Array<ICartItem>; //only in stock items
    allItems: Array<ICartItem>; //including out of stock used in cartFilledStep

    //money
    discountInPresentmentCurrency: number;
    itemsCostInEUR: number;
    shippingCostInEUR: number;
    costs: {
      items: number;
      shipping: number;
      discount: number;
    };

    //ui related
    isStepError: boolean;
    isLoadingInProgress: boolean;
    isDiscountLoading: boolean;
    //workflow? related
    isShippingCostReady: boolean;
    step: string;

    //requires for storefront
    storefrontCheckoutId: string;
    checkoutId: number; //does it used?
    attributes: object; //cart attributes
  }
}
