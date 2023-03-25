import React, { FunctionComponent } from "react";
import { useTranslate } from "@Core/i18n";

import "./index.scss";

export interface TypeProps {
  customerNote?: string;
  onNoteUpdate: (newCustomerNote: string) => void;
  lang?: string;
}

const defaultTranslationKeys = {
  cart: {
    comment: {
      title: "КОММЕНТАРИЙ К ЗАКАЗУ",
      placeholder: "Есть ли что-то еще, что мы должны знать о вашей коже.",
    },
  },
};

const CartNote: FunctionComponent<TypeProps> = ({
  customerNote,
  onNoteUpdate,
  lang,
}) => {
  const t = useTranslate("PageCheckout", lang, defaultTranslationKeys);

  const prepNoteUpdate = (event) => {
    const newNote = event.target.value.trim();
    if (customerNote != newNote) onNoteUpdate(newNote);
  };

  return (
    <div className="CartNote">
      <label className="title" htmlFor="CartNote">
        {t("cart.comment.title")}
      </label>
      <textarea
        id="CartNote"
        onBlur={prepNoteUpdate}
        defaultValue={customerNote}
        placeholder={t("cart.comment.placeholder")}
      />
    </div>
  );
};

export default CartNote;
