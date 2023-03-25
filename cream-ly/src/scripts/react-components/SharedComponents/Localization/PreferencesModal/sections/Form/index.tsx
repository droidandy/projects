//@ts-nocheck
import React, { Component } from "react";
import { translate } from "../../../../../../core/i18n";
import Header from "../../../../../Structure/Header";
import Button from "../../../../../Structure/Button";
import actionSaveUserPreferences from "./actions/actionSaveUserPreferences";
import * as RegionsConfig from "@Core/app/regions";

import { connect } from "@Components/index";
import "./index.scss";
import CrossIcon from "@Components/SharedComponents/Localization/CrossIcon";
import RadioButton from "@Components/Structure/RadioButton";
import { useTranslate } from "@Core/i18n";

/*
<option value="EUR">€&nbsp;EUR</option>
<option value="USD">$&nbsp;USD</option>
<option value="GBP">£&nbsp;GBP</option>
<option value="CAD">$&nbsp;CAD</option>
<option value="DKK">kr.&nbsp;DKK</option>
<option value="BYN">БЕЛ&nbsp;РУБ.</option>
<option value="RUB">₽&nbsp;РУБ.</option> */

// @translate(
//   {
//     preferences: {
//       header: "ВАШИ НАСТРОЙКИ",
//       region: "Ваш регион",
//       regionByDeliveryInfo: {
//         BY:
//           "Cтоимость доставки по Республике Беларусь {{deliveryCost}}. При заказе на сумму {{freeAmount}} доставка осуществляется бесплатно",
//         EU:
//           "Cтоимость доставки по Республике Беларусь {{deliveryCost}}. При заказе на сумму {{freeAmount}} доставка осуществляется бесплатно",
//         RU:
//           "Cтоимость доставки по Республике Беларусь {{deliveryCost}}. При заказе на сумму {{freeAmount}} доставка осуществляется бесплатно",
//       },
//       сurrency: "Валюта",
//       language: "Язык",
//       buttonSave: "ОБНОВИТЬ НАСТРОЙКИ",
//     },
//   },
//   "Localization"
// )
class PreferencesForm extends Component {
  state = {
    regionCode: this.props.regionCode,
    currencyCode: this.props.currencyCode,
    languageCode: this.props.lang,
    isLoading: false,
  };

  handleChange = (key, e) => {
    this.setState({
      [key]: e.target.value,
    });

    if (key == "regionCode") {
      const regionSettings = RegionsConfig.getRegionByCode(e.target.value);

      if (!regionSettings.allowedCurrencies.includes(this.state.currencyCode)) {
        this.setState({ currencyCode: regionSettings.allowedCurrencies[0] });
      }
      if (!regionSettings.languages.includes(this.state.languageCode)) {
        this.setState({ languageCode: regionSettings.languages[0] });
      }
    }
  };

  // USE IT BECAUSE WITH THIS METHOD WE CAN PASS LANG
  t = (keyToTranslate) => {
    return useTranslate(
      "Localization",
      this.state.languageCode
    )(keyToTranslate);
  };

  didSettingsChanged = () => {
    return (
      this.state.currencyCode !== this.props.currencyCode ||
      this.state.languageCode !== this.props.lang ||
      this.state.regionCode !== this.props.regionCode
    );
  };

  resetOnClose = () => {
    this.setState({
      regionCode: this.props.regionCode,
      currencyCode: this.props.currencyCode,
      languageCode: this.props.lang,
    });
  };

  getCurrency() {
    return this.state.currencyCode;
  }

  render() {
    if (!this.props.regionPopupVisibility) {
      return null;
    }

    const regionSettings = RegionsConfig.getRegionByCode(this.state.regionCode);
    const ALLOWED_CURRENCIES_FOR_REGION = regionSettings.allowedCurrencies;
    const ALLOWED_LANGUAGES_FOR_REGION = regionSettings.languages;
    const REGIONS_LIST = RegionsConfig.getRegionCodesList();

    return (
      <div className="PreferencesForm">
        <div
          className="close"
          onClick={() => {
            this.props.setRegionPopupVisibility(false);
            this.resetOnClose();
            if (typeof this.props.actionOnCancel == "function")
              this.props.actionOnCancel();
          }}
        >
          <CrossIcon />
        </div>

        <Header text={this.t("preferences.header")} />

        <div className="line language">
          <div className="label">{this.t("preferences.language")}:</div>
          <div className="d-flex"></div>
          {ALLOWED_LANGUAGES_FOR_REGION.length > 1 ? (
            ALLOWED_LANGUAGES_FOR_REGION.map((lang) => {
              return (
                <RadioButton
                  id={`radion-button-${lang}`}
                  key={lang}
                  value={lang}
                  checked={this.state.languageCode === lang}
                  label={this.t("languages." + lang)}
                  handleChange={(e) => this.handleChange("languageCode", e)}
                />
              );
            })
          ) : (
            <div className="value">
              {this.t("languages." + ALLOWED_LANGUAGES_FOR_REGION[0])}
            </div>
          )}
        </div>

        <div className="line region">
          <div className="label">{this.t("preferences.region")}</div>
          <select
            onChange={(e) => this.handleChange("regionCode", e)}
            className="w-100"
            defaultValue={this.state.regionCode}
          >
            {REGIONS_LIST.map((regionCode) => {
              return (
                <option key={regionCode} value={regionCode}>
                  {this.t("regions." + regionCode)}
                </option>
              );
            })}
          </select>
        </div>

        {/*
          <div className="regionByDeliveryInfo">
          {this.t(`preferences.regionByDeliveryInfo.${this.state.regionCode}`, {
            deliveryCost: `${this.props.deliveryCost} ${this.getCurrency()}`,
            freeAmount: `${this.props.freeAmount} ${this.getCurrency()}`,
          })}
        </div>

        */}
        <div className="line currency">
          <div className="label">{this.t("preferences.сurrency")}:</div>
          {ALLOWED_CURRENCIES_FOR_REGION.length > 1 ? (
            <select
              onChange={(e) => this.handleChange("currencyCode", e)}
              className="w-100"
              defaultValue={this.props.currencyCode}
            >
              {ALLOWED_CURRENCIES_FOR_REGION.map((currencyCode) => {
                return (
                  <option key={currencyCode} value={currencyCode}>
                    {this.t("currencies." + currencyCode) +
                      ` (${currencyCode})`}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="value">
              {this.t("currencies." + ALLOWED_CURRENCIES_FOR_REGION[0]) +
                ` (${ALLOWED_CURRENCIES_FOR_REGION[0]})`}
            </div>
          )}
        </div>

        <Button
          className="mt-3"
          green
          disabled={!this.didSettingsChanged()}
          onClick={async () =>
            await this.props.actionOnSave(
              this.state.regionCode,
              this.state.currencyCode,
              this.state.languageCode
            )
          }
          isLoading={this.state.isLoading}
          text={this.t("Localization:preferences.buttonSave")}
        />
      </div>
    );
  }
}

PreferencesForm.defaultProps = {
  actionOnSave: actionSaveUserPreferences,
  regionCode: "EU",
  currencyCode: "EUR",
  lang: "ru",
};

const mapStateToProps = (state: ReduxShape, ownProps) => {
  const host = ownProps.host ? ownProps.host : state.theme.host;

  return {
    host,
    currencyCode: ownProps.currencyCode
      ? ownProps.currencyCode
      : state.theme.currency.isoCode,
    regionCode: ownProps.regionCode
      ? ownProps.regionCode
      : state.app.localizationSettings.regionCode,
  };
};
export default connect(mapStateToProps)(PreferencesForm);
