import React from "react";
import { Liquid } from "liquidjs";

import EmailNotification from ".";

export const getTitleData = (lang) => {
  return "Emails/Orders/OrderRefund/" + lang.toUpperCase();
};

const lang = "ru";

export default {
  title: getTitleData(lang),
  component: EmailNotification,
  excludeStories: /.*Data$/,
};

const props = {
  templateName: "order_refund",
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
    subtotal_line_items: [
      {
        product: {
          tags: "videoProduct",
          title: "Видео-Курс Антицеллюлитный cамомассаж",
        },
        quantity: 1,
        image:
          "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_b75d1679-abb0-47cf-bd60-aba2f8a65341_compact_cropped.png?v=1587648558",
      },
      {
        product: {
          id: 4168063451190,
          title: "Индивидуальные упражнения для вашего лица",
        },
        quantity: 1,
        image:
          "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_b75d1679-abb0-47cf-bd60-aba2f8a65341_compact_cropped.png?v=1587648558",
      },
    ],
    shop: {
      url: "http://cream.ly",
      email: "alena@cream.ly",
      email_logo_url:
        "https://cdn.shopify.com/s/files/1/2367/5871/email_settings/52893395_2339151539647963_7361826399226691584_n-2.jpg?21579",
      email_logo_width: "180",
    },
  },
};

export const example1 = (extraProps) => {
  props.options.attributes.lang = extraProps.lang;

  return <EmailNotification {...props} {...extraProps} />;
};
