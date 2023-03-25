/* eslint-disable sort-class-members/sort-class-members */
// @ts-nocheck
import React from "react";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PreferencesForm from "../SharedComponents/Localization/PreferencesModal/sections/Form";

import "./index.scss";

import Header from "@Components/Structure/Header";
import Price from "../Price";
import regions from "@Core/app/regions/config";

import {
  filterZonesByCountryCode,
  defaultDeliveryInfo,
  getDeliveryRangeInfo
} from "./helpers";
import ArrowIcon from "./ArrowIcon";

const LS_PREFERENCES_KEY = "creamly.app.user.deliveryPreferences";

const priorityRESTregionCountries = ["AU", "CY", "IL"];

const Divider = () => <div className="divider" />;

@translate({}, "PageDelivery")
class PageDelivery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: "",
      provinceCode: "",
      countryCodes: [],
      provinceCodes: [],
      deliveryInfo: null,
      regionPopupVisibility: false
    };
  }

  componentDidMount() {
    const { countryCode, regionCode } = this.props;
    this.tryToSetCountryCodeByRegion(regionCode, countryCode);
  }

  componentDidUpdate(prevProps, prevState) {
    const { countryCodes, countryCode, provinceCode } = this.state;
    const isCountryCodeChanged = countryCode !== prevState.countryCode;
    const isProvinceCodeChanged = provinceCode !== prevState.provinceCode;

    if (isCountryCodeChanged) {
      this.tryToGetDeliveryInfo(countryCodes, countryCode);
    }

    if (isProvinceCodeChanged) {
      this.tryToGetDeliveryInfo(countryCodes, countryCode, provinceCode);
    }
  }

  generateContent() {
    const { regionCode } = this.props;
    const {
      deliveryInfo,
      provinceCodes,
      provinceCode,
      countryCodes,
      countryCode
    } = this.state;

    const {
      minDeliveryCost,
      maxDeliveryCost,
      minFreeDeliveryAmount,
      maxFreeDeliveryAmount
    } = deliveryInfo;

    const deliveryCost = <Price priceInEUR={maxDeliveryCost} />;
    const minFreeAmount = <Price priceInEUR={minFreeDeliveryAmount} />;
    const maxFreeAmount = <Price priceInEUR={maxFreeDeliveryAmount} />;
    const deliveryMin = <Price priceInEUR={minDeliveryCost} />;
    const deliveryMax = <Price priceInEUR={maxDeliveryCost} />;
    const deliveryCostRange = this.t("deliveryCostRange", {
      deliveryMin,
      deliveryMax
    });
    const freeAmountRange = this.t("rangeCost", {
      cost1: minFreeAmount,
      cost2: maxFreeAmount,
    });

    const isRange =
      (provinceCodes.length && !provinceCode) ||
      (countryCodes.length && !countryCode);

    const regionDeliveryCost = this.t(`regionDeliveryCost.${regionCode}`, {
      deliveryCost:
        isRange && minDeliveryCost !== maxDeliveryCost
          ? deliveryCostRange
          : deliveryCost,
      deliveryCostDescription:
        isRange && minDeliveryCost !== maxDeliveryCost
          ? this.t("deliveryCostDescription")
          : "",
      freeAmount:
        isRange && minFreeDeliveryAmount !== maxFreeDeliveryAmount
          ? freeAmountRange
          : maxFreeAmount
    });

    const regionDeliveryMethodAndTerms = this.t(
      `regionDeliveryMethodAndTerms.${regionCode}`
    );

    const deliveryContent = this.t("deliveryInfo", {
      regionDeliveryMethodAndTerms,
      regionDeliveryCost
    });

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: deliveryContent
        }}
      />
    );
  }

  setPriorityCountryCodesForSorting = () => {
    const { regionCode } = this.props;
    if (regionCode === "REST") {
      return priorityRESTregionCountries;
    }
    return [];
  };

  sortCountryList = (a, b) => {
    const priority = this.setPriorityCountryCodesForSorting();
    if (priority.includes(a.code) && priority.includes(b.code)) {
      // if both items are exceptions
      return a.name - b.name;
    } else if (priority.includes(a.code)) {
      // only `a` is in exceptions, sort it to front
      return -1;
    } else if (priority.includes(b.code)) {
      // only `b` is in exceptions, sort it to back
      return 1;
    } else {
      // no exceptions to account for, return alphabetic sort
      return a.name.localeCompare(b.name);
    }
  };

  makeCountryList = (
    countryCodes: string[]
  ): { code: string; name: string }[] => {
    const { regionCode } = this.props;

    const defaultItem = { code: "", name: this.t("chooseCountryItemLabel") };
    const divider = { isDivider: true, code: "", name: "" };
    const list = [
      defaultItem,
      ...countryCodes
        .map((countryCode: string) => ({
          code: countryCode,
          name: this.t(`Countries:${countryCode}`),
        }))
        .sort(this.sortCountryList)
    ];

    if (regionCode === "REST") {
      list.splice(priorityRESTregionCountries.length + 1, 0, divider);
    }

    return list;
  };

  tryToSetCountryCodeByRegion = (regionCode: string, countryCode = "") => {
    if (regionCode in regions) {
      const isCountryCodes = regions[regionCode].countryCodes.length;
      if (isCountryCodes) {
        const { countryCodes } = regions[regionCode];
        if (isCountryCodes === 1) {
          this.setState({ countryCode: countryCodes[0] });
        } else {
          // check if automatched countryCode in region
          const isAutomatchedCountryCode = countryCode
            ? countryCodes.includes(countryCode)
            : false;
          this.setState({
            countryCodes: this.makeCountryList(countryCodes),
            countryCode: isAutomatchedCountryCode ? countryCode : ""
          });
          this.tryToGetDeliveryInfo(
            this.makeCountryList(countryCodes),
            isAutomatchedCountryCode ? countryCode : ""
          );
        }
      } else {
        console.error("No country codes");
        this.setState({ deliveryInfo: defaultDeliveryInfo });
      }
    } else {
      console.error("No such region");
      this.setState({ deliveryInfo: defaultDeliveryInfo });
    }
  };

  getProvincesCodes = (filteredZones, countryCode) => {
    const defaultItem = { code: "", name: this.t("chooseRegionItemLabel") };

    const filteredProvincies = filteredZones
      .reduce((acc, zone) => [...acc, ...zone.countries[0].provinces], [])
      .map(item => ({
        ...item,
        name:
          countryCode === "RU"
            ? this.t(`Provinces:${countryCode}.${item.code}`)
            : item.name
      }));

    return [defaultItem, ...filteredProvincies];
  };

  tryToGetDeliveryInfo = (countryCodes, countryCode, provinceCode = "") => {
    const { regionCode } = this.props;

    const countryCodesFormated = countryCodes
      .filter(item => item.code)
      .map(item => item.code);

    const countryFilter = countryCode ? [countryCode] : countryCodesFormated;
    const filteredZones = filterZonesByCountryCode(countryFilter, provinceCode);

    if (filteredZones.length) {
      if (filteredZones.length === 1) {
        const deliveryInfo = getDeliveryRangeInfo(filteredZones);
        this.setState({ deliveryInfo });
      } else if (countryCode) {
        const provinceCodes = this.getProvincesCodes(
          filteredZones,
          countryCode
        );

        const isProvincyCodeExist = provinceCodes.find(
          province =>
            this.props.provinceCode && province.code === this.props.provinceCode
        );

        if (isProvincyCodeExist) {
          this.setState({
            provinceCode: this.props.provinceCode
          });
        } else {
          // merge here zones and generate delivery info
          this.setState({
            deliveryInfo: getDeliveryRangeInfo(filteredZones)
          });
        }
        this.setState({ provinceCodes });
      } else {
        this.setState({
          deliveryInfo: getDeliveryRangeInfo(filteredZones)
        });
      }
    } else {
      this.setState({ deliveryInfo: defaultDeliveryInfo });
    }
  };

  handleChange = (key, value) => {
    if (key === "countryCode") {
      if (this.state.provinceCode) {
        this.setState({ provinceCode: "", provinceCodes: [] });
      }
      if (!value) this.setState({ deliveryInfo: null });
    }

    if (this.props[key] !== value) {
      this.setDeliveryPreferencesToLS(key, value);
    }

    this.setState({ [key]: value });
  };

  setDeliveryPreferencesToLS = (key, value) => {
    const { regionCode } = this.props;

    try {
      const deliveryPreferencesFromLs = localStorage.getItem(
        LS_PREFERENCES_KEY
      );
      const parsedDeliveryPreferences =
        JSON.parse(deliveryPreferencesFromLs) || {};

      const serializedPreferences = JSON.stringify({
        ...parsedDeliveryPreferences,
        [regionCode]: {
          isSelectedByUser: true,
          updateTime: new Date().getTime(),
          [key]: value,
        }
      });
      localStorage.setItem(LS_PREFERENCES_KEY, serializedPreferences);
    } catch (err) {
      console.log("error: problem with save preferences to ls");
    }
  };

  setRegionPopupVisibility = regionPopupVisibility => {
    this.setState({
      regionPopupVisibility
    });
  };

  render() {
    const {
      provinceCodes,
      countryCodes,
      countryCode,
      provinceCode,
      deliveryInfo
    } = this.state;

    const isShowProvinceSelect = provinceCodes.length > 0;

    const region = this.t(`Localization:regions.${this.props.regionCode}`);

    return (
      <div className="componentPageDelivery">
        <Header isPageHeader text={this.t("header")} />

        <div>
          <div>
            <span className="label label--noPadding">
              {`${this.t("yourChosenDeliveryRegionLabel")}: `}
            </span>
            {region}
          </div>
          <div>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.setRegionPopupVisibility(
                  !this.state.regionPopupVisibility
                );
              }}
            >
              {this.t("changeRegionLabel")}
            </a>
          </div>
        </div>

        <div className="my-4">
          {countryCodes.length > 0 && (
            <>
              <div className="label">{this.t("countryLabel")}</div>
              <Autocomplete
                id="country-select"
                disabledItemsFocusable
                value={
                  countryCodes.find(({ code }) => code === countryCode) || null
                }
                onChange={(event, value) =>
                  this.handleChange("countryCode", value.code) || ""
                }
                // blurOnSelect
                disableClearable
                classes={{
                  root: "autocomplete",
                  input: "autocomplete-input",
                }}
                options={countryCodes}
                getOptionLabel={(option) => option.name}
                getOptionDisabled={(option) => option.isDivider}
                renderOption={(option) => {
                  if (option.isDivider) {
                    return <Divider />;
                  }
                  return option.name;
                }}
                renderInput={params => (
                  <div
                    ref={params.InputProps.ref}
                    className="select-input-wrapper"
                  >
                    <input type="text" {...params.inputProps} />
                    <ArrowIcon className="select-arrow" />
                  </div>
                )}
              />
            </>
          )}

          {isShowProvinceSelect && (
            <>
              <div className="label">{this.t("provinceLabel")}</div>
              <Autocomplete
                id="provinces-select"
                value={
                  provinceCodes.find(({ code }) => code === provinceCode) ||
                  null
                }
                blurOnSelect
                onChange={(event, value) =>
                  this.handleChange("provinceCode", value.code)
                }
                options={provinceCodes}
                getOptionLabel={option => option.name}
                classes={{
                  root: "autocomplete",
                  input: "autocomplete-input"
                }}
                renderInput={params => (
                  <div
                    ref={params.InputProps.ref}
                    className="select-input-wrapper"
                  >
                    <input type="text" {...params.inputProps} />
                    <ArrowIcon className="select-arrow" />
                  </div>
                )}
              />
            </>
          )}
        </div>

        {deliveryInfo && <div>{this.generateContent()}</div>}

        <PreferencesForm
          setRegionPopupVisibility={this.setRegionPopupVisibility}
          regionPopupVisibility={this.state.regionPopupVisibility}
          {...this.props.regionSettings}
          lang={this.props.lang}
        />
      </div>
    );
  }
}

const checkIfSavedValues = (key, automatchedValue, regionCode) => {
  try {
    const deliveryPreferencesFromLS = localStorage.getItem(LS_PREFERENCES_KEY);
    const parseddeliveryPreferences =
      JSON.parse(deliveryPreferencesFromLS) || null;

    const val =
      parseddeliveryPreferences &&
      parseddeliveryPreferences[regionCode] &&
      parseddeliveryPreferences[regionCode][key];

    if (val && typeof val === "string" && val !== automatchedValue) {
      return val;
    }
    return automatchedValue || "";
  } catch (error) {
    return automatchedValue || "";
  }
};

const mapStateToProps = (state, ownProps) => {
  const regionCode = ownProps.regionCode
    ? ownProps.regionCode
    : state.app.localizationSettings.regionCode;
  const countryCode =
    "countryCode" in ownProps
      ? ownProps.countryCode
      : state.app.location.countryCode;
  const provinceCode =
    "provinceCode" in ownProps
      ? ownProps.countryCode
      : state.app.location.provinceCode;
  return {
    regionCode,
    countryCode: checkIfSavedValues("countryCode", countryCode, regionCode),
    provinceCode: checkIfSavedValues("provinceCode", provinceCode, regionCode),
  };
};

export default connect(mapStateToProps)(PageDelivery);
