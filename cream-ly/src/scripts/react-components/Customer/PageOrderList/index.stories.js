import React from "react";

import PageOrderList from ".";
import { getVideosList } from "@Core/products/video";

// import ordersExample from "./order.json";
import ordersExample from "./order.json";
import videoOrdersDataExample from "./testData.json";

export default {
  title: "Pages/Customer/OrdersList/RU",
  component: PageOrderList,
  excludeStories: /.*Data$/,
};

const email = "test@email.com";

export const noOrders = (props) => {
  return <PageOrderList {...props} email={email} />;
};

const defaultOrder = ordersExample.order;

export const videoOrders = (props) => {
  const sku = [
    "Video-Level4-buccal-massage",
    "Video-Limfa-Level2",
    "Video-FaceMassage-Level1",
  ];

  return (
    <PageOrderList
      orders={[
        {
          ...defaultOrder,
          items: defaultOrder.items.map((item, i) => {
            return { ...item, sku: sku[i] };
          }),
        },
      ]}
      {...props}
      email={email}
    />
  );
};

export const canceledOrders = (props) => {
  return (
    <PageOrderList
      orders={[
        {
          ...defaultOrder,
          financial_status: "refunded",
          fulfillment_status: "none",
        },
        {
          ...defaultOrder,
          financial_status: "voided",
          fulfillment_status: "none",
        },
      ]}
      {...props}
      email={email}
    />
  );
};

export const acceptedOrders = (props) => {
  return (
    <PageOrderList
      orders={[
        {
          ...defaultOrder,
          financial_status: "paid",
          fulfillment_status: "none",
        },
      ]}
      {...props}
      email={email}
    />
  );
};

export const withNoteOrders = (props) => {
  return (
    <PageOrderList
      orders={[
        {
          ...defaultOrder,
          note:
            "Но если вы заполните квиз - я обещаю развеселиться в компании отличных натуральных уходовых средств. Но если вы заполните квиз - я обещаю развеселиться в компании отличных натуральных уходовых средств.",
        },
      ]}
      {...props}
      email={email}
    />
  );
};

export const withVideos = (props) => {
  return (
    <PageOrderList
      videos={getVideosList()}
      customerVideos={[
        "video-aging",
        "video-4-buccal-massage",
        "video-5-guasha-massage",
        "video-6-cellulite",
        "video-7-mewing",
      ]}
      orders={videoOrdersDataExample.orders}
      {...props}
      email={email}
    />
  );
};

const orderWithCustomProduct = {
  name: "#7908",
  created_at: "2020-08-21",
  financial_status: "paid",
  fulfillment_status: "fulfilled",
  items: [
    {
      id: 4152584241206,
      variant_id: null,
      title: "Extra cream",
      quantity: 1,
      sku: null,
      variant_title: "",
      fulfillment_service: "manual",
      product_id: null,
      requires_shipping: false,
      taxable: true,
      gift_card: false,
      name: "Extra cream",
      variant_inventory_management: null,
      properties: [],
      product_exists: false,
      fulfillable_quantity: 0,
      grams: 0,
      price: "48.00",
      total_discount: "0.00",
      fulfillment_status: "fulfilled",
    },
  ],
};

export const withCustomProduct = (props) => {
  return (
    <PageOrderList
      videos={getVideosList()}
      orders={[orderWithCustomProduct]}
      {...props}
      email={email}
    />
  );
};
