import React, { useState, useEffect } from "react";

import * as RegionsConfig from "@Core/app/regions";
import { identifyRegion } from "@Core/app/localization";
import { connect } from "@Components/index";
import { useTranslate } from "@Core/i18n";

import useMountTransition from "@Core/hooks/useMountTransition";
import Button from "@Components/Structure/Button";
import CrossIcon from "../CrossIcon";
import RegionIcon from "./RegionIcon";

import actions from "./actions";

import "./index.scss";

interface ActionArgs {
  lang?: string;
  setRegionPopupVisibility?: (show: boolean) => void;
  setIsMounted?: (show: boolean) => void;
}

interface ISuggestionModal {
  lang: string;
  regionCode?: string;
  autoMatchedRegion?: string;
  isShow: boolean;
  modalType: "defaultRegion" | "shopRegion";
  setRegionPopupVisibility: (show: boolean) => void;
  handleConfirm: (args: ActionArgs) => void;
  handleCancel: (args: ActionArgs) => void;
  handleClose: () => void;
}

const ChangeRegion = ({
  lang = "ru",
  regionCode = "EU",
  autoMatchedRegion = "EU",
  isShow = false,
  modalType = "defaultRegion",
  setRegionPopupVisibility,
  handleConfirm,
  handleCancel,
  handleClose,
}: ISuggestionModal) => {
  const [chosenLang, setLang] = useState(lang);
  const [isMounted, setIsMounted] = useState(false);
  const hasTransitionedIn = useMountTransition(isMounted, 1000);

  const t = useTranslate("Localization", chosenLang);

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setIsMounted(isShow);
      }, 3000);
    } else {
      setIsMounted(isShow);
    }
  }, [isShow]);

  const toggleLang = (e) => {
    e.preventDefault();
    setLang(chosenLang === "ru" ? "en" : "ru");
  };

  const closeModal = () => {
    setIsMounted(false);
    handleClose();
  };

  const transformRegion = (code: string) =>
    code === "REST"
      ? `${t("regions." + code)} ${t("regions.description." + code)}`
      : t("regions." + code)
        .toUpperCase()
        .split(" (")[0];

  const regionTitle = t(`SuggestionModal.${modalType}.title`, {
    region_current: transformRegion(regionCode),
    region_suggested: transformRegion(autoMatchedRegion)
  });

  if (hasTransitionedIn || isMounted) {
    return (
      <div className={`SuggestionModal ${hasTransitionedIn && "in"} ${isMounted && "visible"}`}>
        <div className="content">
          <div className="close" onClick={closeModal}>
            <CrossIcon />
          </div>
          <div className="text">{regionTitle}</div>

          <div className="buttons">
            <Button
              green
              onClick={() => handleConfirm({ lang: chosenLang })}
              text={t(`SuggestionModal.${modalType}.confirm`)}
            />
            <Button
              greenBorder
              onClick={() =>
                handleCancel({ lang, setRegionPopupVisibility, setIsMounted })
              }
              text={t(`SuggestionModal.${modalType}.cancel`)}
            />
          </div>
          <div className="switchLang">
            <RegionIcon />
            <a href="#" onClick={toggleLang}>
              {t("ButtonSwitchToNativeLang")}
            </a>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const autoMatchedRegion = RegionsConfig
    .getRegionMatchingCountryCode(state.app.location.countryCode).regionCode ||
    state.app.localizationSettings.regionCode;

  const setModalType = () => {
    if (ownProps.modalType) return ownProps.modalType;
    if (
      state.app.localizationSettings.regionCode !== autoMatchedRegion
    ) {
      return "shopRegion";
    }
    return "defaultRegion";
  };

  const setShow = () => {
    if (ownProps.isShowModal) return true;
    if (actions.checkIfWasRejected() || state.app.isRegionSelectedByUser) {
      return false;
    }

    return true;
  };

  const isShow = setShow();
  const modalType = setModalType();

  const handleClose = () => actions.onClose();

  const handleConfirm = ({ lang }) => {
    if (modalType === "defaultRegion") {
      actions.saveLocalizationSetting(lang);
    }
    if (modalType === "shopRegion") {
      actions.redirectToDefaultRegion(lang, autoMatchedRegion);
    }
  };

  const handleCancel = ({ lang, setRegionPopupVisibility, setIsMounted }) => {
    if (modalType === "defaultRegion") {
      setRegionPopupVisibility(true);
      setIsMounted(false);
    }
    if (modalType === "shopRegion") {
      actions.saveLocalizationSetting(lang);
    }
  };

  return {
    regionCode: ownProps.regionCode
      ? ownProps.regionCode
      : state.app.localizationSettings.regionCode,
    autoMatchedRegion,
    isShow,
    modalType,
    handleClose,
    handleConfirm,
    handleCancel,
  };
};
export default connect(mapStateToProps)(ChangeRegion);
