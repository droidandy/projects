import React, { Component } from "react";
import { connect } from "@Components/index";
import Icon from "./Icon";
import "./index.scss";

export const PRICE_SYMBOLS = {
  BYN: "р",
  RUB: "₽",
  USD: "$",
  UAH: "₴",
  GBP: "£",
  CAD: "$",
  CHF: "₣",
  EUR: "€",
};

interface IRegionIcon {
  actionOnClick: () => void;
  currencyCode: string;
  regionCode: string;
}

const RegionIcon = ({
  actionOnClick,
  currencyCode,
  regionCode,
}: IRegionIcon) => {
  const isRest = "REST" === regionCode;
  return (
    <span className="ComponentRegionIcon" onClick={actionOnClick}>
      <Icon currencySymbol={PRICE_SYMBOLS[currencyCode] || ""} />
      {!isRest && <span className="regionCode">{regionCode}</span>}
    </span>
  );
};

const mapStateToProps = (state: ReduxShape, ownProps) => {
  return {
    regionCode: ownProps.regionCode
      ? ownProps.regionCode
      : state.app.localizationSettings.regionCode,
    currencyCode: ownProps.currencyCode
      ? ownProps.currencyCode
      : state.app.localizationSettings.currencyCode,
  };
};

export default connect(mapStateToProps)(RegionIcon);
