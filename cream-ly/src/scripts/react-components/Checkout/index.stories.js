import React from "react";

import { action, actions } from "@storybook/addon-actions";

import Checkout from ".";

export default {
  title: "Pages/CartCheckout/RU",
  component: Checkout,
  excludeStories: /.*Data$/,
};

function resolveAfter1Second(checkoutState) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ test: "resolved" });
      action("resolveAfter1Second", checkoutState);
      //onFinishCallback();
    }, 200);
  });
}

const emptyAddressAndEmail = {
  email: "",
  shippingAddress: {
    address1: "",
    address2: "",
    city: "",
    company: "",
    countryCode: "",
    province: "",
    provinceCode: "",
    zip: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
  },
};

const props = {
  items: [],

  email: "test@email.com",

  storefrontCheckoutId:
    "Z2lkOi8vc2hvcGlmeS9DaGVja291dC80YWU3ZWI3YTA3Njk0NzJkNzZlZjExMzNjMTgxMjE3ZD9rZXk9MWMwNTI5ZDc5ZjMzZDJlNTdkNzllNTE0NzYzNzkyOTc=",

  attributes: {
    selectedProducts:
      "[&quot;cream-my-skin&quot;,&quot;flower-powder-my-skin&quot;,&quot;nourish-my-skin&quot;,&quot;exfoliate-my-skin&quot;]",
    skinCareGoals: "[&quot;pimple&quot;]",
    skinType: "normal",
    videoGoals: "[&quot;wrinkles&quot;,&quot;capillaries&quot;]",
  },
  note: "some test note",

  onBeforeStepChange: resolveAfter1Second,
  onAfterStepChange: resolveAfter1Second,
  onStateChange: resolveAfter1Second,
};

const itemDigital = (function() {
  const item = {
    id: 30115694510134,
    properties: null,
    quantity: 1,
    variant_id: 30115694510134,
    key: "30115694510134:7325e3c8c4516730e8e482722a5b3b45",
    title: "Видео-Курс омоложения лица - полная",
    price: 2300,
    original_price: 2300,
    discounted_price: 2300,
    line_price: 2300,
    original_line_price: 2300,
    total_discount: 0,
    discounts: [],
    sku: "Video-FaceMassage-Level1",
    grams: 0,
    vendor: "CREAM.LY",
    taxable: true,
    product_id: 2313399861302,
    product_has_only_default_variant: false,
    gift_card: false,
    final_price: 2300,
    final_line_price: 2300,
    url: "/products/video-1?variant=30115694510134",
    featured_image: {
      aspect_ratio: 0.93,
      alt: "Видео-Курс омоложения лица",
      height: 640,
      url:
        "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage.png?v=1575640056",
      width: 595,
    },
    image:
      "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage.png?v=1575640056",
    handle: "video-1",
    requires_shipping: false,
    product_type: "",
    product_title: "Видео-Курс омоложения лица",
    product_description:
      "Не всех целей в уходе за кожей можно достичь с помощью только лишь косметики (даже с такими бомбическими составами, как в CREAM.LY). Косметика работает на уровне кожи, а:\n\nморщинки зачастую образовываются глубже - мышцы уходят в гипер-тонус, кожа на них складывается и получается залом кожи-морщинка.\n\n\nЧтобы решить эти проблемы, нужны мануальные техники, усиливающие кровоток, снимающие отечность и напряжение с мышц, но не у всех есть время ходить на массаж\nПоэтому мы подготовили для вас базовый комплекс упражнений для работы с лицом 2-3 раза в неделю. В результате комплекса упражнений лицо подтянется, “угол молодости” станет более четким, скулы получат свое очертание, уменьшится второй подбородок и морщинки на лбу. А еще расслабится шея и зона декольте, соответственно уменьшатся линии на шее, уйдут отеки с области глаз и поднимутся уголки рта ☺\n split \nАвтор курса Наталья Чичук - доктор-невролог, международный тренер по массажным техникам и техникам расслабления мышц и фасций.\n\nЧто вы получите?\n\nВы получите доступ к видео тренинга \nТренинг состоит из 3 частей:\n\nНемного понятной анатомии и знаний о том, почему работа с лицом начинается как минимум с работы с зоной декольте, какие мышцы на теле могут влиять на морщинки на лице и о природе возникновения морщинок\nДетальное описание техники упражнений и противопоказаний\nВерсия “5 минут утром”, для выполнения комплекса упражнений вместе с видео и в режиме реального времени, как часть утреннего ухода всего 2-3 раза в неделю\n\n\nОтзывы о курсе\n",
    variant_title: "полная",
    variant_options: ["полная"],
    options_with_values: [{ name: "Версия", value: "полная" }],
    line_level_discount_allocations: [],
    line_level_total_discount: 0,
  };
  item.image_url =
    "//cdn.shopify.com/s/files/1/2367/5871/products/Massage_x360.png?v=1575640056";

  item.properties = [];

  return item;
})();

const itemPhysical = (function() {
  const item = {
    id: 20354414313526,
    properties: null,
    quantity: 1,
    variant_id: 20354414313526,
    key: "20354414313526:abb1130bda2bbec5dbcffadfb4512cd2",

    title: "CREAM MY SKIN with Peptides",
    product_title: "CREAM MY SKIN with Peptides",

    price: 5500,
    sku: "SKU-cream-peptides",
    product_has_only_default_variant: true,
    final_price: 5500,
    final_line_price: 5500,
    url: "/products/cream-my-skin-with-peptides?variant=20354414313526",
    image:
      "https://cdn.shopify.com/s/files/1/2367/5871/products/cream_-_3000px_-_with_patern_png_8edf4f5f-3a00-4a6b-8e76-66872ccabf3c.png?v=1569367897",
    handle: "cream-my-skin-with-peptides",
    requires_shipping: true,
    product_type: "",
  };
  item.image_url =
    "//cdn.shopify.com/s/files/1/2367/5871/products/cream_-_3000px_-_with_patern_png_8edf4f5f-3a00-4a6b-8e76-66872ccabf3c_x360.png?v=1569367897";

  item.properties = [];

  return item;
})();

export const itemsData = [itemDigital, itemPhysical];

export const empty = () => <Checkout />;

const byData = {
  ...props,
  defaultCountryCode: "BY",
  shippingAddress: {
    address1: "Stalinstreet 1",
    address2: "",
    city: "Minsk",
    company: "",
    countryCode: "BY",
    province: "",
    provinceCode: "",
    zip: "12345",
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
    street: "",
  },
};

export const BY_digital = () => <Checkout {...byData} items={[itemDigital]} />;

export const BY_shipping = () => <Checkout {...byData} items={itemsData} />;

const addressWithCompany = {
  ...byData.shippingAddress,
  company: "Google",
};

export const withCompany = () => (
  <Checkout
    {...byData}
    items={itemsData}
    shippingAddress={addressWithCompany}
  />
);

const ruData = {
  ...byData,
  defaultCountryCode: "RU",
  shippingAddress: {
    ...byData.shippingAddress,
    countryCode: "RU",
    provinceCode: "MOW",
  },
};

export const RU_digital = () => <Checkout {...ruData} items={[itemDigital]} />;

export const RU_shipping = () => <Checkout {...ruData} items={itemsData} />;

export const defaultShopify = () => <Checkout {...props} items={itemsData} />;

const freeData = {
  ...props,
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
  },
};
export const free = () => (
  <Checkout {...freeData} items={[{ ...itemDigital, price: 0 }]} />
);

export const stepError = () => (
  <Checkout items={itemsData} isStepError={true} />
);

export const freeNoAddress = () => (
  <Checkout
    {...freeData}
    {...emptyAddressAndEmail}
    items={[{ ...itemDigital, price: 0 }]}
  />
);
