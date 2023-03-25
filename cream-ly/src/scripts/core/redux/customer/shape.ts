export default interface CustomerStateShape {
  id: Number;
  email: String;
  tags: Array<String>;
  defaultCountryCode: String;
  addresses: Array<Address>;
  defaultAddressId: Number;
  orders: Array<Order>;
  lastOrderId: Number;
  //skinType: string;
  videos:Array<String>;
}

export type Address = {
  id: Number;
  address1: String;
  address2: String;
  city: String;
  company: String;
  country: String;
  country_code: String;
  first_name: String;
  last_name: String;
  phone: String;
  province: String;
  province_code: String;
  zip: String;
};

export type Order = {
  id: Number;
  name: String;
  note: String;
  financial_status: String;
  fulfillment_status: String;
  items: Array<OrderItem>;
};

export type OrderItem = {
  id: Number;
  title: String;
  sku: String;
  variantId: Number;
  price: Number;
  quantity: Number;
  properties: Array<String>;
};
