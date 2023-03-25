export default interface IStorefrontResponseCheckout {
  data: {
    node: IStorefrontCheckout;
  };
  errors?: Array<IStorefrontResponseError>;
}

export interface IStorefrontResponseError {
  message: string;
  locations: Array<Object>;
  extensions: {
    value: any;
    problems: Array<any>;
  };
}

declare global {
  namespace ShopifyStorefront {
    interface ICheckout extends IStorefrontCheckout {}
  }
}

export interface IStorefrontCheckout {
  id: string;
  webUrl: string;
  ready: boolean;
  requiresShipping: boolean;
  note: null | string;
  email: string;

  paymentDue: string;
  currencyCode: string;
  paymentDueV2: {
    amount: string;
    currencyCode: string;
  };

  subtotalPrice: string;
  subtotalPriceV2: PriceV2;
  lineItemsSubtotalPrice: PriceV2;
  totalPrice: string;
  totalPriceV2: PriceV2;

  shippingAddress: null | IShippingAddress;
  shippingLine: null | string;
  lineItems: Array<LineItems>;
  discountApplications: {
    pageInfo: IPageInfo;
    edges: [
      {
        node: DiscountApplication;
      }
    ];
  };
  customAttributes: Array<{ key: string; value: string }>;
}

interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LineItems {
  pageInfo: IPageInfo;
  edges: LineItemsEdge[];
}

export interface LineItemsEdge {
  cursor: string;
  node: PurpleNode;
}

export interface PurpleNode {
  id: string;
  title: string;
  variant: Variant;
  quantity: number;
  customAttributes: any[];
  discountAllocations: DiscountAllocation[];
}

export interface DiscountAllocation {
  allocatedAmount: PriceV2;
  discountApplication: DiscountApplication;
}

export interface PriceV2 {
  amount: string;
  currencyCode: string;
}

export interface DiscountApplication {
  targetSelection: string;
  allocationMethod: string;
  targetType: string;
  value: Value;
  code: string;
  applicable: boolean;
}

export interface Value {
  percentage: number;
}

export interface Variant {
  id: string;
  title: string;
  price: string;
  priceV2: PriceV2;
  presentmentPrices: PresentmentPrices;
  weight: number;
  available: boolean;
  sku: string;
  compareAtPrice: null;
  compareAtPriceV2: null;
  image: Image;
  selectedOptions: SelectedOption[];
  product: Product;
}

export interface Image {
  id: string;
  src: string;
  altText: null;
}

export interface PresentmentPrices {
  pageInfo: IPageInfo;
  edges: PresentmentPricesEdge[];
}

export interface PresentmentPricesEdge {
  node: FluffyNode;
}

export interface FluffyNode {
  price: PriceV2;
  compareAtPrice: null;
}

export interface Product {
  id: string;
  handle: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface IShippingAddress {}
