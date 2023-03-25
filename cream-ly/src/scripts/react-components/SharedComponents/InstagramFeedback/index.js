import React from "react";
import * as elfsight from "@elfsight/embed-sdk";

import Header from "@Components/Structure/Header";
import "./index.scss";

import {useTranslate} from "@Core/i18n";

const widgetIdInstagramFeedback = "752cf8c3-b7e3-4355-a392-3e20f0777cd4";

const InstagramFeedback = ({ lang }) => {
  const t = useTranslate("InstagramFeedback", lang);
  const widgetContainter = React.createRef();

  React.useEffect(() => {
    if (lang !== "ru") return;
    elfsight.ElfsightEmbedSDK.displayWidget(
      widgetContainter.current,
      widgetIdInstagramFeedback
    );
  }, []);

  if (lang !== "ru") return null;

  return (
    <div className="InstagramFeedback spacingBottom">
      <Header text={t("title")} />
      <div className="subTitle">{t("subtitle")}</div>
      <div ref={widgetContainter} />
    </div>
  );
};

export default InstagramFeedback;
