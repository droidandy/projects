import React from "react";
import { useTranslate } from "@Core/i18n";
import { connect } from "@Components/index";
import PageLink from "@Components/Structure/PageLink";
import Button from "@Components/Structure/Button";

import "./index.scss";

interface PromoProps {
  isQuizReady: string;
}

const Promo = ({ isQuizReady }: PromoProps) => {
  const t = useTranslate("HomePromoMain");

  return (
    <div className="Promo">
      <div className="content">
        <div className="title">
          <h1>{t("title")}</h1>
          <div
            className="subtitle"
            dangerouslySetInnerHTML={{ __html: t("subtitle") }}
          />
        </div>
        <div className="buttonArea">
          <PageLink
            dataTest={isQuizReady ? "linkQuizResults" : "linkQuiz"}
            pageType={"PAGE_QUIZ_OR_RESULTS"}
          >
            <Button green={Boolean(isQuizReady)} rose={!Boolean(isQuizReady)}>
              {t(isQuizReady ? "buttonResultText" : "buttonText")}
            </Button>
          </PageLink>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isQuizReady: state.quiz.isReady,
  };
};

export default connect(mapStateToProps)(Promo);
