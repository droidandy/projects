import React from "react";
import { useTranslate } from "@Core/i18n";

const AppNotification = ({ lang }) => {
  const t = useTranslate("common", lang);
  return (
    <div
      className="quizNotification"
      dangerouslySetInnerHTML={{ __html: t("app.notification") }}
    />
  );
};

export default AppNotification;
