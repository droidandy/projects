import React, { FunctionComponent } from "react";
import { useTranslate } from "@Core/i18n";
import "./index.scss";

export interface TypeProps {
  isActive?: boolean;
  lang?: string;
}

const IconDelete: FunctionComponent<TypeProps> = ({ isActive, lang }) => {
  const t = useTranslate("PageCheckout", lang);

  return (
    <div className="IconDelete">
      <svg
        className={isActive ? "active" : null}
        viewBox="0 0 22 25"
        fill="none"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{t("cart.items.remove")}</title>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 22.0045C19.5 23.4773 18.4728 24.5 17 24.5H5C3.529 24.5 2.50248 23.471 2.5 22V7.48374L19.5 7.5V22.0045Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.5 7.5H0.5V3.33334L21.5 3.5V7.5Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5 3.44445L7.5 3.38889V0.5H14.5V3.44445Z"
        />
      </svg>
    </div>
  );
};

export default IconDelete;
