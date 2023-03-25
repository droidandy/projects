// @ts-nocheck
import React, { useState, useEffect } from "react";
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";
import Button from "@Components/Structure/Button";
import ColorButton from "@Components/Structure/ColorButton";

import "./index.scss";

interface IClickAddToCart {
  (variantId: number | null): void;
}

interface IVariant {
  isOutOfStock: boolean;
}

interface ICandleQuizProps {
  lang: string;
  variants: Record<string, IVariant>;
  selectedSKU: string;
  onComplete: IClickAddToCart;
  onChangeVariant: (value: string) => void;
  variantIsOutOfStock: boolean;
}

const CandleQuiz = ({
  lang,
  selectedSKU,
  variants,
  onComplete,
  onChangeVariant,
  variantIsOutOfStock,
}: ICandleQuizProps) => {
  const t = useTranslate("PageQuiz", lang);
  const [newSKU, setSKU] = useState(selectedSKU);

  const variantsKeys = Object.keys(variants);

  const availableVariants = variantsKeys.filter(
    (key: string) => !variants[key].isOutOfStock
  );

  useEffect(() => {
    if (
      availableVariants.length > 0 &&
      !availableVariants.includes(selectedSKU)
    ) {
      setSKU(availableVariants[0]);
      onChangeVariant(availableVariants[0]);
    }
  }, []);

  const colors = variantsKeys.map((key: string) => key.split("-").slice(-1)[0]);

  const handleChange = (value: string) => {
    const sku = `sku-candle-${value}`;
    setSKU(sku);
    onChangeVariant(sku);
  };

  const colorMapper = {
    grey: "#e2e7e7",
    pink: "#f489af",
  };

  const [color] = newSKU.split("-").slice(-1);

  return (
    <div className="candleQuiz">
      <div className="field">
        <div className="label">
          {`${t("PageProductDetails:colorFieldLabel")} - ${t(`PageProductDetails:colours.${color}`)}`}
        </div>
        {colors.map((key: string) => (
          <ColorButton
            key={key}
            handleClick={(value: string) => handleChange(value)}
            color={colorMapper[key]}
            active={key === color}
            disabled={variants[`sku-candle-${key}`].isOutOfStock}
            value={key}
          />
        ))}
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

const mapStateToProps = (state, ownProps: ICandleQuizProps) => {
  return {};
};

export default connect(mapStateToProps)(CandleQuiz);
