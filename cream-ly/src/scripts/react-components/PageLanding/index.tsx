// @ts-nocheck
import React from "react";
import { useTranslate } from "@Core/i18n";
import "./index.scss";
import PageQuiz from "@Components/PageQuiz";
import Header from "@Components/Structure/Header";

import { connect } from "@Components/index";

const PageLanding = ({ lang }) => {
  const t = useTranslate("PageAbout", lang);

  return (
    <div className="PageLanding">
      <div className="imgTop"></div>

      <Header isPageHeader text={t("header")} />
      <p>{t("about")}</p>

      <blockquote className="blockquote">
        <p>{t("ownerText")}</p>
        <h4>{t("owner")}</h4>
      </blockquote>
      <p>{t("advantages")}</p>

      <PageQuiz />
    </div>
  );
};

export default connect()(PageLanding);
