import React, { FunctionComponent } from "react";
import { useTranslate } from "@Core/i18n";
import Price from "@Components/Price";
import IconDelete from "./IconDelete";
import Badge from "@Components/Structure/Badge";

import "./index.scss";

export interface TypeProps {
  item?: ICartItem;
  onItemUpdate: (newQuantity: number) => void;
  lang?: string;
}

const CartItem: FunctionComponent<TypeProps> = ({
  item,
  onItemUpdate,
  lang,
}) => {
  const t = useTranslate("products", lang);

  const handleQuantityBlur = (e) => {
    return onItemUpdate(Number(e.target.value));
  };

  const handleDelete = (e) => {
    return onItemUpdate(0);
  };

  return (
    <div className="CartItem row no-gutter">
      <div className="image">
        <a href={item.product.url}>
          <img src={item.product.imageURL} alt={item.product.title} />
        </a>
      </div>
      <div className="title">
        <a href={item.product.url}>
          {t(`${item.product.handle}.title`, {}, item.product.title)}
        </a>
        {item.isOutOfStock && <Badge lang={lang} isOutOfStock />}
        <div className="properties">
          {renderProperties(item, lang)}
        </div>
      </div>
      <div className="price">
        {!item.isOutOfStock && <Price lang={lang} price={item.price} />}
      </div>
      <div className="quantity">
        {!item.isOutOfStock && item.price > 0 && (
          <input
            type="number"
            min="0"
            max="100"
            pattern="[0-9]*"
            defaultValue={item.quantity}
            onBlur={handleQuantityBlur}
          />
        )}
        {item.price == 0 && item.quantity}
      </div>
      <div className="priceTotal">
        {!item.isOutOfStock && (
          <Price lang={lang} price={item.price} quantity={item.quantity} />
        )}
      </div>
      <div className="remove">
        <a onClick={handleDelete}>
          <IconDelete />
        </a>
      </div>
    </div>
  );
};

const renderProperties = (item, lang: string) => {
  const { properties, product: { handle }, sku } = item;

  const tCheckout = useTranslate("PageCheckout", lang);
  const tQuiz = useTranslate("PageQuiz", lang);
  const tProducts = useTranslate("products", lang);
  const tProductsDetails = useTranslate("PageProductDetails", lang);

  return (
    <>
      {properties && properties.skinType ? (
        <div>
          {tCheckout("cart.labelSkinType")}:{" "}
          {tQuiz(`skinTypes.${properties.skinType}`).toLowerCase()}
        </div>
      ) : null}
      {properties && properties.skinGoals && properties.skinGoals.length > 0 ? (
        <div>
          {tCheckout("cart.labelSkinCareGoals")}:{" "}
          {properties.skinGoals
            .map(goal =>
              tCheckout(`cart.shortTitleGoals.${goal}`).toLowerCase()
            )
            .join(", ")}
        </div>
      ) : null}
      {[
        "cream-my-skin",
        "nourish-my-skin",
        "cream-my-body",
        "cream-my-skin-with-peptides",
        "clean-my-skin",
      ].includes(handle) && (
          <div>
            {tProductsDetails("variantType")}:{" "}
            {tProducts(`${handle}.${sku}.variantType`)}
          </div>
        )}
    </>
  );
};

export default CartItem;
