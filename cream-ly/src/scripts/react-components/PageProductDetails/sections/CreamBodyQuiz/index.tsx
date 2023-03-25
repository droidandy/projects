import React, { useState, useEffect } from "react";
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";
import { getBodyCreamSKU } from "@Core/quiz";
import { getVariantIdBySKU } from "@Core/products";

import OptionsSelector from "@Components/PageQuiz/sections/question";
import { getOptions } from "@Components/PageQuiz/sections/questionGoals";
import Button from "@Components/Structure/Button";
import Error from "@Components/Structure/Error";

import "./index.scss";

interface IClickAddToCart {
  (variantId: number | null): void;
}

interface IMiniQuizProps {
  lang: string;
  fulfillmentCode: string;
  initiallySelectedGoals: string[];
  onComplete: IClickAddToCart;
  onChange: (sku: string) => void;
  variantIsOutOfStock: boolean;
}

const allowedGoals = ["body", "body_atopic"];

const filterInitialGoals = (initialGoals: string[]): string[] => {
  return initialGoals.filter((goal) => allowedGoals.includes(goal));
};

const handleClickOnButton = (goals, onComplete, setError) => {
  if (!Array.isArray(goals) || goals.length == 0) return setError(true);

  const sku = getBodyCreamSKU(goals).sku;
  if (!sku) return setError(true);

  // we can set body type skin here manually if needed
  return onComplete(getVariantIdBySKU(sku), null, goals);
};

const MiniQuiz = ({
  lang,
  initiallySelectedGoals,
  fulfillmentCode,
  onComplete,
  onChange,
  variantIsOutOfStock,
}: IMiniQuizProps) => {
  const t = useTranslate("PageQuiz", lang);

  const [selectedGoals, setGoals] = useState(initiallySelectedGoals);
  const [isError, setError] = useState(false);

  useEffect(() => {
    setGoals(initiallySelectedGoals);
    onChange(getBodyCreamSKU(initiallySelectedGoals).sku);
  }, []);

  const options = React.useMemo(
    () => getOptions("bodyGoals", fulfillmentCode).filter(({ key }) => allowedGoals.includes(key)),
    [fulfillmentCode]
  );

  return (
    <div className="creamMyBodyQuiz">
      <div className="goalsLabel">{t("PageProductDetails:skinCareGoals")}</div>
      {isError && <Error text={t("errorGoals")} />}
      <OptionsSelector
        group={"bodyGoals"}
        allowMultiSelect={true}
        options={options}
        selected={initiallySelectedGoals}
        lang={lang}
        onChange={(newGoals) => {
          setGoals(newGoals);
          onChange(getBodyCreamSKU(newGoals).sku);
          if (isError && newGoals && newGoals.length) setError(false);
        }}
      />
      <Button
        green
        extra={{ "data-test": "buttonProductQuizSubmit" }}
        onClick={() => handleClickOnButton(selectedGoals, onComplete, setError)}
        text={t("PageProductDetails:buttonAddToCart")}
        disabled={variantIsOutOfStock}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps: IMiniQuizProps) => {
  return {
    initiallySelectedGoals: ownProps.initiallySelectedGoals
      ? ownProps.initiallySelectedGoals
      : filterInitialGoals(state.quiz.skinCareGoals),
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,
  };
};

export default connect(mapStateToProps)(MiniQuiz);
