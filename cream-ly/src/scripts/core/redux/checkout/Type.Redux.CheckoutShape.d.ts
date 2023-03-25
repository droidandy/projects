export {};
declare global {
  interface IReduxCheckoutShape {
    isLoaded: boolean;
    items: ICartItem[];
    itemsCount: number;
    note: string;

    storefrontCheckoutId?: string;
    checkoutId?: number;
  }
}
