import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Aux from "../../hoc/Aux";
import TopPanel from "../Container/TopPanel/TopPanel";
import history from "../../history";
import classNames from "classnames";
import LanguageInputSelect from "../Common/LanguageInputSelect";
import axios from "axios";
import Input from "../../components/Input";
import Modal from "react-modal";

import { createApplicationRequest } from "../../actions/application";
import { fetchApplicationsRequest } from "../../actions/applications";

import image1 from "../../assets/images/image-shared_secret_1.jpg";
import image2 from "../../assets/images/image-shared_secret_2.jpg";

import androidIcon from "../../assets/images/icons/android-icon.svg";
import IOSIcon from "../../assets/images/icons/apple-icon.svg";
import TextArea from "../../components/TextArea/TextArea";
import Tip from "../../containers/Common/Tip";
import {isStringValidJson, track, validation} from "../../libs/helpers";
import { NotificationManager } from "../../libs/Notifications";
import styles from "../Container/AppSettings/IOSApp/IOSAppSettings/styles.module.scss";
import { SingleDatePicker } from "react-dates";
import moment from "moment";

import s from "./styles.module.scss";


const Warning = () => {
  return (
    <svg className={s.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.72356 12.5528L7.10553 1.78887C7.47405 1.05182 8.52586 1.05182 8.89438 1.78887L14.2763 12.5528C14.6088 13.2177 14.1253 14 13.3819 14H2.61799C1.87461 14 1.39111 13.2177 1.72356 12.5528ZM7.24995 5.5H8.74995V9.5H7.24995V5.5ZM7.99995 12C8.55224 12 8.99995 11.5523 8.99995 11C8.99995 10.4477 8.55224 10 7.99995 10C7.44767 10 6.99995 10.4477 6.99995 11C6.99995 11.5523 7.44767 12 7.99995 12Z" fill="#97ADC6"/>
    </svg>
  );
}

const Under = () => {
  return (
    <p className={s.tip}>
      If you’re enrolled, don’t forget to put entry date so we can calculate proceeds correctly!
    </p>
  );
}

const AppleSmallBusinessProgramTip = () => {
  return (
    <>
      <p className={s.tip}>
        App Store Small Business Program goal is to reduce Apple's commission of App Store sales for small businesses from 30% to 15%.&nbsp;
        <a
          onClick={() => track("ios_app_onboarding_small_business_program_link_clicked")}
          href="https://docs.apphud.com/other/app-store-small-business-program"
          target="_blank"
        >
          Read more
        </a>
      </p>
      <Under />
    </>
  );
}

const GoogleSmallBusinessProgramTip = () => {
  return (
    <>
      <p className={s.tip}>
        Google Play Reduced Service Fee goal is to reduce commission of Google Play in-app’s sales for small businesses from 30% to 15%.&nbsp;
        <a
          onClick={() => track("android_app_onboarding_small_business_program_link_clicked")}
          href="https://docs.apphud.com/other/google-play-reduced-service-fee"
          target="_blank"
        >
          Read more
        </a>
      </p>
      <Under />
    </>
  );
}

const customStylesPopUp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 980,
    overlfow: "visible"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
};

class NewApp extends Component {
  state = {
    showSharedSecret: false,
    allLanguages: [],
    focusedFirst: false,
    focusedSecond: false,
    android: {
      package_name: "",
      google_service_account_json: "",
      play_store_sbp_start_date: null
    },
    ios: {
      bundle_id: "",
      appstore_shared_secret: "",
      appstore_app_id: null,
      sbp_start_date: null
    },
    common: {
      name: "",
      default_locale: "en"
    },
    androidExpanded: false,
    iosExpanded: false
  };

  from = "dashboard";

  componentDidMount() {
    document.title = "Apphud | New app";

    if (this.props.history.location.search === "?onboarding=1") {
      this.from = "onboarding";
    }
  }

  handleStateChange = (field, value, type, platform) => {
    if (type === "number") value = parseInt(value, 10);

    if (field === "appstore_shared_secret") value = value.replace(/ /, "");

    this.setState({
      ...this.state,
      [platform]: {
        ...this.state[platform],
        [field]: value
      }
    });
  };

  isIosFieldsValid = () => {
    const {
      bundle_id,
      appstore_shared_secret,
      appstore_app_id
    } = this.state.ios;

    return (
      bundle_id &&
      appstore_shared_secret &&
      !this.getSharedSecretErrors("appstore_shared_secret").length
    );
  };

  isAndroidFieldsValid = () => {
    const { package_name, google_service_account_json } = this.state.android;
    return (
      package_name &&
      google_service_account_json &&
      isStringValidJson(google_service_account_json)
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let params = JSON.parse(JSON.stringify({ ...this.state.common }));
    if (this.state.androidExpanded) {
      params = {
        ...params,
        ...this.state.android
      };
    }

    if (this.state.iosExpanded) {
      params = {
        ...params,
        ...this.state.ios
      };
    }

    const { name } = this.state.common;

    this.setState({ submitted: true });
    if (
      name &&
      this.validation(name, "name") &&
      (this.state.iosExpanded ? this.isIosFieldsValid() : true) &&
      (this.state.androidExpanded ? this.isAndroidFieldsValid() : true)
    ) {
      this.props.createApplicationRequest(params, (app) => {
        history.push({
          pathname: `/configureapp/${app.id}/1`,
          search: this.props.history.location.search
        });
        this.props.fetchApplicationsRequest()
        const platform = this.isIosFieldsValid() && 'ios' || this.isAndroidFieldsValid() && 'android';
        let props = {
          email: this.props.user.email,
          app_id: app.id,
          app_name: app.name,
        };
        if (this.isIosFieldsValid()) {
          props.app_appstore_id = app.appstore_app_id;
          props.smb_entry_date = this.state.ios.sbp_start_date;
        }
        if (this.isAndroidFieldsValid()) {
          props.app_bundle_id = app.bundle_id;
          props.smb_entry_date = this.state.android.play_store_sbp_start_date;
        }
        track(`${platform}_app_created`, props);
      });
    }
  };

  validation = (value, field) => {
    if (field === "name") return /^[A-Za-z0-9А-ЯЁа-яё_]+/gi.test(value);
    if (field === "appstore_shared_secret") return /^[a-z0-9]+$/.test(value);
  };

  inputNameErrors = (field) => {
    const invalid = !this.state.common[field] && this.state.submitted;

    return invalid ? [field] : [];
  };

  goBack = () => {
    history.goBack();
  };

  componentWillMount() {
    this.props.fetchApplicationsRequest();
    this.getLanguages();
  }

  handleChangeLocalization = (item) => {
    this.setState({
      common: {
        ...this.state.common,
        default_locale: item.code,
        locales: [item.code]
      }
    });
  };

  onUploadJSONButtonClick = async(e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      const textFromFile = await file.text();
      if (typeof textFromFile === "string") {
        if (isStringValidJson(textFromFile)) {
          this.setState({
            ...this.state,
            android: {
              ...this.state.android,
              google_service_account_json: textFromFile.trim()
            }
          });
          NotificationManager.success("JSON copied to field", "OK", 5000);
          return;
        }
      }
      NotificationManager.error("Invalid JSON", "OK", 5000);
    } catch (e) {
      console.error(e);
    }
  };

  getIsRequiredError = (field, platform) => {
    const invalid = this.state.submitted && !this.state[platform][field];

    return invalid ? [field] : [];
  };

  getSharedSecretErrors = () => {
    const invalid =
      this.state.submitted &&
      !validation(
        this.state.ios.appstore_shared_secret,
        "appstore_shared_secret"
      );

    return invalid ? ["appstore_shared_secret"] : [];
  };

  getJsonError = (field) => {
    const invalid =
      this.state.submitted &&
      (!this.state.android[field] ||
        !isStringValidJson(this.state.android[field]));
    return invalid ? [field] : [];
  };

  getLanguages = () => {
    const { application } = this.props;

    axios.get("/languages").then(({ data }) => {
      this.setState({ allLanguages: data.data.results });
    });
  };

  handleShowSharedSecretModal = () => {
    this.setState({ showSharedSecretModal: !this.state.showSharedSecretModal });
  };

  render() {
    const {
      ios: { bundle_id, appstore_shared_secret, appstore_app_id, sbp_start_date },
      android: { package_name, google_service_account_json, play_store_sbp_start_date },
      common: { name, default_locale },
      allLanguages,
      showSharedSecretModal
    } = this.state;
    console.log("this.state:: ", this.state);
    return (
      <Aux>
        <div className="newapp">
          <TopPanel disableMenu={true} />
          <div className="newapp-header">
            <div className="newapp-container">
              {this.props.applications.length > 0 && (
                <button
                  onClick={this.goBack}
                  className="button button_blue newapp-container__button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.41422 6.53554L6.94975 3L8.36396 4.41421L5.77817 7H13V9H5.87868L8.36396 11.4853L6.94975 12.8995L3.41421 9.36396L2 7.94975L3.41422 6.53554Z"
                      fill="white"
                    />
                  </svg>
                </button>
              )}
              <div
                className="input-wrapper ta-right"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span className="newapp-header__title">Add new app</span>
                <button
                  className="button button_green l-p__button mt0"
                  style={{ marginRight: "-190px", marginLeft: "auto" }}
                  disabled={
                    !this.state.iosExpanded && !this.state.androidExpanded
                  }
                  onClick={this.handleSubmit}
                >
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
          <div className="newapp-content">
            <div className="newapp-container">
              <form className="newapp-container__form">
                <input type="hidden" value="xxx" />
                <Input
                  label="App name"
                  value={name}
                  onChange={({ value, type }) =>
                    this.handleStateChange("name", value, type, "common")
                  }
                  type="text"
                  id="name"
                  name="name"
                  required={true}
                  errors={this.inputNameErrors("name")}
                  placeholder="App name"
                  bottomText="App name is used to identify the app through the platform"
                />
                <div className="input-wrapper ta-left">
                  <label
                    className="l-p__label l-p__label_required"
                    htmlFor="default_localization"
                  >
                    Default localization
                  </label>
                  <LanguageInputSelect
                    name="default_localization"
                    placeholder="Default localization"
                    value={allLanguages.find((l) => l.code === default_locale)}
                    onChange={this.handleChangeLocalization}
                    isSearchable={false}
                    getOptionLabel={({ name }) => name}
                    getOptionValue={({ code }) => code}
                    autoFocus={false}
                    clearable={false}
                    classNamePrefix="input-select"
                    className="input-select input-select_blue newapp-language__select"
                    options={allLanguages}
                  />
                  <div className="input-wrapper__bottom-text">
                    You will be able to add more localizations later
                  </div>
                </div>
                <div className={"container-content__onboarding-platform-container"}>
                  <div className="container-content__onboarding-platform-header">
                    <img src={IOSIcon} alt="iosicon" />
                    <div className="container-content__onboarding-platform-title">
                      The app is available on iOS
                    </div>
                    <div className="container-content__integrations-switcher container-content__onboarding-platform-switcher">
                      <label className="switcher switcher_green">
                        <input
                          id="viewSandbox"
                          onChange={() => {
                            this.setState({
                              iosExpanded: !this.state.iosExpanded
                            })
                            track("onboarding_sdk_ios_tab_selected");
                          }}
                          checked={this.state.iosExpanded}
                          type="checkbox"
                          className="ios-switch green"
                        />
                        <div>
                          <div></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  {this.state.iosExpanded && (
                    <div className="container-content__onboarding-platform-content">
                      <Input
                        label={"App Store app ID"}
                        value={appstore_app_id || ""}
                        onChange={({ value, type }) =>
                          this.handleStateChange(
                            "appstore_app_id",
                            value.trim(),
                            type,
                            "ios"
                          )
                        }
                        type={"number"}
                        id="appstore_app_id"
                        name="appstore_app_id"
                        required={false}
                        errors={[]}
                        placeholder="App ID without “id” prefix, e.g.: 123456789"
                      />
                      <Input
                        label={"Bundle ID"}
                        value={bundle_id}
                        onChange={({ value, type }) =>
                          this.handleStateChange("bundle_id", value.trim(), type, "ios")
                        }
                        type={"text"}
                        id="bundle_id"
                        name="bundle_id"
                        required={true}
                        errors={this.getIsRequiredError("bundle_id", "ios")}
                        placeholder="com.company.app"
                        autoComplete="off"
                      />
                      <Input
                        label={"App Store shared secret"}
                        value={appstore_shared_secret || ""}
                        onChange={({ value, type }) =>
                          this.handleStateChange(
                            "appstore_shared_secret",
                            value.trim(),
                            type,
                            "ios"
                          )
                        }
                        type={"text"}
                        id="appstore_shared_secret"
                        name="appstore_shared_secret"
                        errors={this.getSharedSecretErrors()}
                        placeholder="Shared secret"
                        required={true}
                        showHideButton={true}
                        autoComplete="new-password"
                        bottomText={
                          <a
                            href="https://docs.apphud.com/getting-started/creating-app#app-store-shared-secret"
                            className="link cp"
                            target="_blank"
                          >
                            How to find App Store shared secret?
                          </a>
                        }
                      />
                      <div className={styles.settings}>
                        <div className={styles["group-picker"]}>
                          <label className={"label"}>
                            Apple Small Business Program
                            <Tip description={<AppleSmallBusinessProgramTip />}>
                              <Warning />
                            </Tip>
                          </label>
                          <SingleDatePicker
                            openDirection={"up"}
                            noBorder
                            block
                            isOutsideRange={(day) => {
                              const curr = day;
                              const need = moment(new Date(2021, 0));
                              return need.isAfter(curr);
                            }}
                            readOnly
                            displayFormat={() => moment.localeData().longDateFormat("LL")}
                            monthFormat={"MMMM YYYY"}
                            date={sbp_start_date ? moment(sbp_start_date) : null}
                            onDateChange={(date) => {
                              this.handleStateChange(
                                "sbp_start_date",
                                moment(date).format("YYYY-MM-DD"),
                                "date",
                                "ios"
                              )
                            }}
                            focused={this.state.focusedFirst}
                            onFocusChange={({ focused }) =>
                              this.setState({ focusedFirst: focused })
                            }
                            id="date_1313"
                            placeholder="Entry date"
                          />

                          <p className={s.message}>
                            Entry date is effective date of entry the program. Must be Jan 1,
                            2021 or later.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={"container-content__onboarding-platform-container"}>
                  <div className="container-content__onboarding-platform-header">
                    <img src={androidIcon} alt="androidIcon" />
                    <div className="container-content__onboarding-platform-title ml4">
                      The app is available on Android
                    </div>
                    <div className="container-content__integrations-switcher container-content__onboarding-platform-switcher">
                      <label className="switcher switcher_green">
                        <input
                          id="viewSandbox"
                          onChange={() => {
                            this.setState({
                              androidExpanded: !this.state.androidExpanded
                            })
                            track("onboarding_sdk_android_tab_selected");
                          }}
                          checked={this.state.androidExpanded}
                          type="checkbox"
                          className="ios-switch green"
                        />
                        <div>
                          <div></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  {this.state.androidExpanded && (
                    <div className="container-content__onboarding-platform-content">
                      <Input
                        label={"Google Play package name"}
                        value={package_name}
                        onChange={({ value, type }) =>
                          this.handleStateChange(
                            "package_name",
                            value.trim(),
                            type,
                            "android"
                          )
                        }
                        type={"text"}
                        id="package_name"
                        required={true}
                        errors={this.getIsRequiredError(
                          "package_name",
                          "android"
                        )}
                        placeholder="com.company.app"
                        autoComplete="new-password"
                      />
                      <TextArea
                        label={"Service account JSON"}
                        placeholder="Paste service account JSON here"
                        onChange={({ value, type }) =>
                          this.handleStateChange(
                            "google_service_account_json",
                            value,
                            type,
                            "android"
                          )
                        }
                        value={google_service_account_json}
                        id="google_service_account_json"
                        required={true}
                        rows={24}
                        errors={this.getJsonError("google_service_account_json")}
                      />
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#97ADC6",
                          marginTop: "10px",
                          marginBottom: "5px"
                        }}
                      >
                        or
                      </div>
                      <form id={"uploadForm" + this.t} name="uploadForm">
                        <label
                          htmlFor={"uploadFile" + this.t}
                          id={"uploadFile"}
                          className="button button_blue button_inline button_160 container-content__appsettings-uploader__button"
                        >
                          Upload JSON file
                        </label>
                        <input
                          className="hidden"
                          name="file"
                          type="file"
                          id={"uploadFile" + this.t}
                          onChange={this.onUploadJSONButtonClick}
                        />
                        <div className="input-wrapper__bottom-text">
                          <a
                            className="link"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://docs.apphud.com/getting-started/creating-app#google-play-service-credentials"
                          >
                            How to find service account JSON?
                          </a>
                          <div></div>
                        </div>
                      </form>
                      <div className={styles.settings}>
                        <div className={styles["group-picker"]}>
                          <label className={"label"}>
                            Google Play Reduced Service Fee
                            <Tip description={<GoogleSmallBusinessProgramTip />}>
                              <Warning />
                            </Tip>
                          </label>
                          <SingleDatePicker
                            openDirection={"up"}
                            noBorder
                            block
                            isOutsideRange={(day) => {
                              const curr = day;
                              const need = moment(new Date(2021, 6));
                              return need.isAfter(curr);
                            }}
                            readOnly
                            displayFormat={() => moment.localeData().longDateFormat("LL")}
                            monthFormat={"MMMM YYYY"}
                            date={play_store_sbp_start_date ? moment(play_store_sbp_start_date) : null}
                            onDateChange={(date) => {
                              this.handleStateChange(
                                "play_store_sbp_start_date",
                                moment(date).format("YYYY-MM-DD"),
                                "date",
                                "android"
                              )
                            }}
                            focused={this.state.focusedSecond}
                            onFocusChange={({ focused }) =>
                              this.setState({ focusedSecond: focused })
                            }
                            id="date_1312"
                            placeholder="Entry date"
                          />

                          <p className={s.message}>
                            Entry date is effective date of entry the program. Must be July 1,
                            2021 or later.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
              <Modal
                isOpen={showSharedSecretModal}
                onRequestClose={this.handleShowSharedSecretModal}
                ariaHideApp={false}
                style={customStylesPopUp}
                contentLabel="How to find App Store shared secret?"
              >
                <div style={{ padding: "20px 30px" }}>
                  <div className="newapp-header__title">
                    How to find App Store shared secret?
                  </div>
                  <div className="input-wrapper" style={{ height: 353 }}>
                    <img
                      src={image1}
                      width="445px"
                      alt="Screenshot 1"
                      style={{ marginRight: 30 }}
                    />
                    <img src={image2} width="445px" alt="Screenshot 2" />
                  </div>
                  <div className="input-wrapper ta-center">
                    <button
                      onClick={this.handleShowSharedSecretModal}
                      className="button button_green button_160"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    applications: state.applications,
    user: state.sessions
  };
};

const mapDispatchToProps = {
  createApplicationRequest,
  fetchApplicationsRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(NewApp);
