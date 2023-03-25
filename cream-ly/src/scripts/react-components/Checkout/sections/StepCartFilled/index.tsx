import React, { FunctionComponent } from "react";
import CartItems from "./Items";
import CartNote from "./CartNote";

import "./index.scss";

export interface Props {
  items?: Array<ICartItem>;
  note: string;
  lang?: string;
  onNoteUpdate: (note: string) => void;
  onItemsUpdate: (items: Array<ICartItem>) => void;
}

const Cart: FunctionComponent<Props> = ({
  items,
  note,
  lang,
  onNoteUpdate,
  onItemsUpdate,
}) => {
  return (
    <div className="StepCartFilled">
      <CartItems
        items={items}
        onItemsQuantityUpdate={onItemsUpdate}
        lang={lang}
      />
      <CartNote customerNote={note} onNoteUpdate={onNoteUpdate} lang={lang} />
    </div>
  );
};
export default Cart;
