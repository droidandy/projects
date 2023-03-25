import React from "react";
import { Liquid } from "liquidjs";

import EmailNotification from ".";

export const getTitleData = (lang) => {
  return "Emails/Orders/ShippingConfirmation/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: EmailNotification,
  excludeStories: /.*Data$/,
};

const props = {
  templateName: "shipping_confirmation",
  options: {
    attributes: { lang },
    order_name: "#8888",
    order_status_url: "https://cream.ly/orders/12345",
    requires_shipping: true,
    subtotal_price: 1000,
    discount_title: "discount_code",
    shipping_address: {
      address1: "a1",
      city: "city",
      countryCode: "RU",
      first_name: "Ivan",
      last_name: "Ivanov",
    },
    shipping_method: {
      title: "доставка курьером",
    },
    shop: {
      url: "http://cream.ly",
      email: "alena@cream.ly",
      email_logo_url:
        "https://cdn.shopify.com/s/files/1/2367/5871/email_settings/52893395_2339151539647963_7361826399226691584_n-2.jpg?21579",
      email_logo_width: "180",
    },
    fulfillment: {
      id: 2255011086390,
      order_id: 2405100552246,
      status: "success",
      created_at: "2020-08-21T12:43:34+02:00",
      service: "manual",
      updated_at: "2020-08-21T12:43:34+02:00",
      tracking_company: null,
      shipment_status: null,
      location_id: 51663051,
      line_items: [
        {
          id: 5171210551350,
          variant_id: 30872258412598,
          title: "Видео-Курс Лимфодренаж",
          quantity: 1,
          sku: "Video-Limfa-Level2",
          variant_title: "полная",
          vendor: "CREAM.LY",
          fulfillment_service: "manual",
          image:
            "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_b75d1679-abb0-47cf-bd60-aba2f8a65341_compact_cropped.png?v=1587648558",
          product_id: 4271132966966,
          requires_shipping: false,
          taxable: true,
          gift_card: false,
          name: "Видео-Курс Лимфодренаж - полная",
          variant_inventory_management: "shopify",
          properties: [],
          line_item: {
            product: {
              tags: "videoProduct",
              title: "Видео-Курс Антицеллюлитный cамомассаж",
            },
            quantity: 1,
            variant: {
              title: "Видео-Курс Антицеллюлитный cамомассаж",
            },
            refunded_quantity: 1,
            line_title: "line_title",
            line_display: "line_display",
            image:
              "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_b75d1679-abb0-47cf-bd60-aba2f8a65341_compact_cropped.png?v=1587648558",
          },
          product_exists: true,
          fulfillable_quantity: 0,
          grams: 0,
          price: "23.00",
          total_discount: "0.00",
          fulfillment_status: "fulfilled",
          price_set: {
            shop_money: {
              amount: "23.00",
              currency_code: "EUR",
            },
            presentment_money: {
              amount: "23.00",
              currency_code: "EUR",
            },
          },
          total_discount_set: {
            shop_money: {
              amount: "0.00",
              currency_code: "EUR",
            },
            presentment_money: {
              amount: "0.00",
              currency_code: "EUR",
            },
          },
          discount_allocations: [
            {
              amount: "22.00",
              discount_application_index: 0,
              amount_set: {
                shop_money: {
                  amount: "22.00",
                  currency_code: "EUR",
                },
                presentment_money: {
                  amount: "22.00",
                  currency_code: "EUR",
                },
              },
            },
          ],
          tax_lines: [
            {
              title: "Btw",
              price: "0.17",
              rate: 0.21,
              price_set: {
                shop_money: {
                  amount: "0.17",
                  currency_code: "EUR",
                },
                presentment_money: {
                  amount: "0.17",
                  currency_code: "EUR",
                },
              },
            },
          ],
        },
      ],
      tracking_number: null,
      tracking_numbers: [],
      tracking_url: null,
      tracking_urls: [],
      receipt: {},
      name: "#7908.1",
    },
  },
};

export const example1 = (extraProps) => {
  props.options.attributes.lang = extraProps.lang;

  return <EmailNotification {...props} {...extraProps} />;
};
