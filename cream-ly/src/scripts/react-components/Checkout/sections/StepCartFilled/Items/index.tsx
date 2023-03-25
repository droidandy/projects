import React, { FunctionComponent } from "react";
import { useTranslate } from "@Core/i18n";
import CartItem from "./CartItem";
import Price from "@Components/Price";
import { convertSumOfPrices } from "@Core/currency";

import "./index.scss";

const defaultTranslationKeys = {
  cart: {
    items: {
      title: "Продукт",
      price: "Стоимость",
      quantity: "Количество",
      remove: "Убрать",
    },
    total: "Всего",
    withVAT: "(включая НДС)",
  },
};

export interface TypeProps {
  items?: Array<ICartItem>;
  onItemsQuantityUpdate: (items: Array<ICartItem>) => void;
  lang?: string;
}

const CartItems: FunctionComponent<TypeProps> = ({
  items,
  lang,
  onItemsQuantityUpdate,
}) => {
  const t = useTranslate("PageCheckout", lang, defaultTranslationKeys);

  const inStockItems = selectInStockItems(items);
  const totalInCurrency: number = inStockItems.length
    ? convertSumOfPrices(inStockItems)
    : 0;

  const handleItemsUpdate = (newQuantity: number, itemKey: string) => {
    return onItemsQuantityUpdate(
      items.map((item) => {
        if (item.key == itemKey) return { ...item, quantity: newQuantity };
        return item;
      })
    );
  };

  return (
    <div className="CartItems">
      <div className="head CartItem row no-gutters">
        <div className="image"></div>
        <div className="title">{t("cart.items.title")}</div>
        <div className="price">{t("cart.items.price")}</div>
        <div className="quantity">{t("cart.items.quantity")}</div>
        <div className="priceTotal"></div>
        <div className="remove">{t("cart.items.remove")}</div>
      </div>
      {items.map(
        (item) =>
          item.quantity > 0 && (
            <CartItem
              key={item.key}
              item={item}
              lang={lang}
              onItemUpdate={(newQuantity: number) => {
                handleItemsUpdate(newQuantity, item.key);
              }}
            />
          )
      )}
      {inStockItems.length > 0 && (
        <footer>
          <div className="subtotal">
            {totalInCurrency > 0 && (
              <span className="label">{t("cart.total")}&nbsp;</span>
            )}
            <span className="amount">
              <Price lang={lang} prices={inStockItems} />
            </span>
            {totalInCurrency > 0 && " " + t("cart.withVAT")}
          </div>
        </footer>
      )}
    </div>
  );
};

export default CartItems;

export const selectInStockItems = (items: ICartItem[]): ICartItem[] => {
  return items.filter(
    (item: ICartItem) => item.isOutOfStock == false && item.quantity > 0
  );
};
