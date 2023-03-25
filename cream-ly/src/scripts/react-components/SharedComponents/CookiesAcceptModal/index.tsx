import React, { useState, useEffect } from "react";
import { useTranslate } from "@Core/i18n";
import Button from "../../Structure/Button";
import useMountTransition from "@Core/hooks/useMountTransition";
import acceptCookies from "./actions";

import "./index.scss";

interface ICookiesAcceptModal {
  lang?: string;
  isShow: boolean;
  acceptCookiesHandle: () => void;
}

const CookiesAcceptModal = ({
  lang = "ru",
  isShow = false,
  acceptCookiesHandle = acceptCookies,
}: ICookiesAcceptModal) => {
  const t = useTranslate("Cookies", lang);
  const [isMounted, setIsMounted] = useState(false);
  const hasTransitionedIn = useMountTransition(isMounted, 1000);

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setIsMounted(isShow);
      }, 9000);
    } else {
      setIsMounted(isShow);
    }
  }, [isShow]);

  if (hasTransitionedIn || isMounted) {
    return (
      <div
        data-nosnippet
        className={`CookiesAcceptModal ${hasTransitionedIn && "in"} ${isMounted && "visible"}`}
      >
        <div className="container">
          <div className="content">
            <div className="text">
              {t("cookiesPopupInfo")}
              <br />
              <br />
              <a href="/pages/privacy-policy">{t("cookiesLinkLabel")}</a>
            </div>

            <div className="buttons">
              <Button
                green
                onClick={acceptCookiesHandle}
                text={t("btnLabel.allow")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return null;
};

export default CookiesAcceptModal;
