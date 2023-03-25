// @ts-nocheck
import React, { useState, useEffect } from "react";
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";
import { getBodyCreamSKU } from "@Core/quiz";
import { getVariantIdBySKU } from "@Core/products";

import OptionsSelector from "@Components/PageQuiz/sections/question";
import { getOptions } from "@Components/PageQuiz/sections/questionGoals";
import Button from "@Components/Structure/Button";
import Error from "@Components/Structure/Error";
import Select from "../Select";
import RadioButton from "@Components/Structure/RadioButton";
import ColorButton from "@Components/Structure/ColorButton";

import "./index.scss";

interface IClickAddToCart {
  (variantId: number | null): void;
}

interface IVariant {
  isOutOfStock: boolean;
}

interface IRobeQuizProps {
  lang: string;
  variants: Record<string, IVariant>;
  selectedSKU: string;
  onComplete: IClickAddToCart;
  onChangeVariant: (value: string) => void;
  variantIsOutOfStock: boolean;
}

const RobeQuiz = ({
  lang,
  selectedSKU,
  variants,
  onComplete,
  onChangeVariant,
  handle,
  variantIsOutOfStock,
}: IRobeQuizProps) => {
  const t = useTranslate("PageQuiz", lang);
  const [newSKU, setSKU] = useState(selectedSKU);

  const variantsKeys = Object.keys(variants);
  const availableVariants = variantsKeys.filter((key: string) => !variants[key].isOutOfStock);
  const isHeadband = handle === "headband";

  useEffect(() => {
    if (
      availableVariants.length > 0 &&
      !availableVariants.includes(selectedSKU)
    ) {
      setSKU(availableVariants[0]);
      onChangeVariant(availableVariants[0]);
    }
  }, []);

  const config = variantsKeys.reduce((acc, key: string) => {
    const [length, color] = key.split("-").slice(-2);
    return {
      ...acc,
      [color]: isHeadband
        ? !variants[key].isOutOfStock
        : {
          ...(acc[color] || {}),
          [length]: !variants[key].isOutOfStock,
        },
    };
  }, {});

  const [length, color] = newSKU.split("-").slice(-2);

  const handleChange = (type, value) => {
    let sku = "";
    if (handle === "robe") {
      if (type === "color") {
        const newLength = config[value][length]
          ? length
          : Object.keys(config[value]).find((key) => config[value][key]);

        sku = `sku-robe-size${newLength === "short" ? 1 : 2}-${newLength}-${value}`;
      }
    }
    if (type === "length") {
      sku = `sku-robe-size${value === "short" ? 1 : 2}-${value}-${color}`;
    }

    if (handle === "headband") {
      sku = `sku-headband-${value}`;
    }

    setSKU(sku);
    onChangeVariant(sku);
  };

  const colorMapper = {
    lavender: "#d8cfd9",
    grey: "#e2e7e7",
    rose: "#f489af",
  };

  return (
    <div className="robeQuiz">
      <div className="fields-wrapper">
        <div className="field">
          <div className="label">{`${t("PageProductDetails:colorFieldLabel")} - ${t(`PageProductDetails:colours.${color}`)}`}</div>
          {Object.keys(config).map((key) => (
            <ColorButton
              key={key}
              handleClick={(value) => handleChange("color", value)}
              color={colorMapper[key]}
              active={key === color}
              disabled={isHeadband ? !config[key] : !config[key].short && !config[key].long}
              value={key}
            />
          ))}
        </div>

        {!isHeadband && color && (
          <div className="field">
            <div className="label">{t("PageProductDetails:sizeFieldLabel")}</div>
            {Object.keys(config[color]).map((key: string) => (
              <RadioButton
                id={`size-${key}`}
                key={key}
                value={key}
                checked={length === key}
                disabled={!config[color][key]}
                label={t(`PageProductDetails:robeSizes.${key}`)}
                handleChange={(event) => handleChange("length", event.target.value)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        green
        onClick={() => {
          const variantId = variants[newSKU].id;
          console.log("variantid", variantId);
          onComplete(variants[newSKU].id);
        }}
        disabled={variantIsOutOfStock}
      >
        {t("PageQuizResult:summary.buttonAddToCart")}
      </Button>
    </div>
  );
};

const handleClickOnButton = (goals, onComplete, setError) => {
  if (!Array.isArray(goals) || goals.length == 0) return setError(true);

  const sku = getBodyCreamSKU(goals).sku;
  if (!sku) return setError(true);

  return onComplete(getVariantIdBySKU(sku));
};

const mapStateToProps = (state, ownProps: IRobeQuizProps) => {
  return {};
};

export default connect(mapStateToProps)(RobeQuiz);
