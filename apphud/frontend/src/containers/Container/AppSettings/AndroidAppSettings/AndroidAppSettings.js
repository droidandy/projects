import React, { Component } from "react";
import { connect } from "react-redux";

import Input from "../../../../components/Input";
import { NotificationManager } from "../../../../libs/Notifications";
import {
  updateApplicationRequest
} from "../../../../actions/application";
import {isStringValidJson, track} from "../../../../libs/helpers";

import androidAppImage from "../../../../assets/images/android-app.add.svg";
import TextArea from "../../../../components/TextArea/TextArea";
import styles from "../IOSApp/IOSAppSettings/styles.module.scss";
import s from "./styles.module.scss";
import plantSvg from "../IOSApp/IOSAppSettings/plant.svg";
import { IoTrash } from "react-icons/io5";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import Tip from "../../../Common/Tip";

const Warning = () => {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.72356 12.5528L7.10553 1.78887C7.47405 1.05182 8.52586 1.05182 8.89438 1.78887L14.2763 12.5528C14.6088 13.2177 14.1253 14 13.3819 14H2.61799C1.87461 14 1.39111 13.2177 1.72356 12.5528ZM7.24995 5.5H8.74995V9.5H7.24995V5.5ZM7.99995 12C8.55224 12 8.99995 11.5523 8.99995 11C8.99995 10.4477 8.55224 10 7.99995 10C7.44767 10 6.99995 10.4477 6.99995 11C6.99995 11.5523 7.44767 12 7.99995 12Z" fill="#97ADC6"/>
    </svg>
  );
}

const Under = () => {
  return (
    <p className={styles.tip}>
      If you’re enrolled, don’t forget to put entry date so we can calculate proceeds correctly!
    </p>
  );
}

const GoogleSmallBusinessProgramTip = () => {
  return (
    <>
      <p className={s.tip}>
        Google Play Reduced Service Fee goal is to reduce commission of Google Play in-app’s sales for small businesses from 30% to 15%.&nbsp;
        <a
          onClick={() => track("android_app_settings_small_business_program_link_clicked")}
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

class AndroidAppSettings extends Component {
  state = {
    packageName: "",
    serviceAccount: "",
    saving: false,
    showSettingsForm: false,
    dateStart: null,
    dateEnd: null,
    focusedFirst: false,
    focusedSecond: false
  };

  componentDidMount() {
    const {application} = this.props;
    document.title = "Apphud | Android app settings";

    this.setState({
      packageName: application.package_name || "",
      serviceAccount: application.google_service_account_json || "",
      showSettingsForm: Boolean(application.package_name),
      saving: false,
      dateStart: application.play_store_sbp_start_date ? moment(application.play_store_sbp_start_date) : null,
      dateEnd: application.play_store_sbp_end_date ? moment(application.play_store_sbp_end_date) : null
    });
  }

  onFieldChange = (field, value) => {
    this.setState({
      ...this.state,
      [field]: value
    });
  };

  getIsRequiredError = (field) => {
    const invalid = this.state.updateSubmitted && !this.state[field];

    return invalid ? [field] : [];
  };

  getJsonError = (field) => {
    const invalid =
      this.state.updateSubmitted &&
      (!this.state[field] || !isStringValidJson(this.state[field]));
    return invalid ? [field] : [];
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { packageName, serviceAccount } = this.state;

    this.setState({
      updateSubmitted: true,
      saving: true
    });

    if (packageName && serviceAccount && isStringValidJson(serviceAccount)) {
      const params = {
        ...this.props.application,
        id: this.props.application.id,
        package_name: packageName,
        google_service_account_json: serviceAccount,
        play_store_sbp_start_date: this.state.dateStart
          ? moment(this.state.dateStart).format("YYYY-MM-DD")
          : "",
        play_store_sbp_end_date: this.state.dateEnd
          ? moment(this.state.dateEnd).format("YYYY-MM-DD")
          : ""
      };

      this.props.updateApplicationRequest(
        params,
        () => {
          this.setState({ updateSubmitted: false, saving: false });
          // this.props.fetchApplicationsRequest();
          track("android_settings_saved", params);
          NotificationManager.success(
            "Android app settings successfully saved",
            "OK",
            5000
          );
        },
        (e) => {
          NotificationManager.error(`Error ${e}`, "OK", 5000);
          this.setState({ saving: false });
        }
      );
    } else {
      this.setState({ saving: false });
    }
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
            serviceAccount: textFromFile.trim()
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

  getAppSettingsForm = () => {
    const { packageName, serviceAccount } = this.state;

    return (
      <form className="appsettings-container__form" autoComplete="off">
        <Input
          label={"Google Play package name"}
          value={packageName}
          onChange={({ value }) => this.onFieldChange("packageName", value.trim())}
          type={"text"}
          id="packageName"
          required={true}
          errors={this.getIsRequiredError("packageName")}
          placeholder="com.company.app"
          autoComplete="new-password"
        />
        <TextArea
          label={"Service account JSON"}
          placeholder="Paste service account JSON here"
          onChange={({ value }) => this.onFieldChange("serviceAccount", value)}
          value={serviceAccount}
          id="serviceAccount"
          required={true}
          rows={24}
          errors={this.getJsonError("serviceAccount")}
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
        </form>
        <div className="input-wrapper__bottom-text">
          <div className="link cp">
            <a
              onClick={() => track("android_settings_json_hint_clicked")}
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.apphud.com/getting-started/creating-app#google-play-service-credentials"
            >
              How to find service account JSON?
            </a>
          </div>
        </div>
        <div className={styles["small-program"]}>
          <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
            <img src={plantSvg} alt="plantIcon" />
            <span>
              Google Play Reduced Service Fee
              {!this.state.dateStart && (
                <Tip description={<GoogleSmallBusinessProgramTip />}>
                  <Warning />
                </Tip>
              )}
            </span>
          </div>

          <div className={styles["group-picker"]}>
            <label>Entry date</label>
            {this.state.dateStart && (
              <span
                onClick={() => {
                  this.setState({
                    dateStart: null,
                    dateEnd: null
                  });
                }}
              >
                <IoTrash size={16} color="#ff0c46" />
              </span>
            )}
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
              date={this.state.dateStart}
              onDateChange={(date) => {
                this.setState({ dateStart: date })
              }}
              focused={this.state.focusedFirst}
              onFocusChange={({ focused }) =>
                this.setState({ focusedFirst: focused })
              }
              id="date_1313"
              placeholder="Entry date"
            />

            <p className={styles.message}>
              Entry date is effective date of entry the program. Must be July 1,
              2021 or later.
            </p>
          </div>

          <div className={styles["group-picker"]}>
            <label>Exit date</label>
            {this.state.dateEnd && (
              <span
                onClick={() => {
                  this.setState({
                    dateEnd: null
                  });
                }}
              >
                <IoTrash size={16} color="#ff0c46" />
              </span>
            )}
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
              date={this.state.dateEnd}
              onDateChange={(date) => {
                this.setState({ dateEnd: date })
              }}
              focused={this.state.focusedSecond}
              onFocusChange={({ focused }) =>
                this.setState({ focusedSecond: focused })
              }
              id="date_23"
              placeholder="Exit date"
              disabled={!this.state.dateStart}
            />
            <p className={styles.message}>
              If you will or have already left the program, add the exit date.{" "}
              <a
                onClick={() => track("android_app_settings_small_business_program_link_clicked")}
                href="https://docs.apphud.com/other/google-play-reduced-service-fee"
                target="_blank">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </form>
    );
  };

  onEnablePlatformButtonClick = () => {
    track("android_platform_enabled")
    this.setState({
      showSettingsForm: true
    });
  };

  getAddAndroidAppBlock = () => {
    return (
      <div className="container-content--integrations-no-webhooks">
        <div style={{ width: "290px", height: "320px" }}>
          <img src={androidAppImage} alt="androidAppImage" />
        </div>
        <div
          className="container-content--integrations-no-webhooks-right"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div className="container-content--integrations-no-webhooks-title">
            The easiest way to handle in-app subscriptions in your Android app
          </div>
          <div className="container-content--integrations-no-webhooks-buttons mt20">
            <button
              className="button button_green l-p__button fr mt0 container-content--integrations-no-webhooks-button ml0"
              onClick={this.onEnablePlatformButtonClick}
            >
              Enable platform
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.settings}>
        <div className="container-content__blue-header pr15">
          <div className="container-title">
            <span className="va-middle text-black">Android app settings</span>
          </div>
          {this.state.showSettingsForm && (
            <button
              disabled={this.state.saving}
              onClick={this.handleSubmit}
              className="button button_green l-p__button fr mt0"
            >
              <span>Save</span>
            </button>
          )}
        </div>
        <div className="container-content__blue-content">
          <div className="container-content__notification">
            <a
              className="container-content__learn-more-btn no"
              href="https://docs.apphud.com/getting-started/sdk-integration"
              target="_blank"
              onClick={() => track("android_settings_learn_more_link_clicked")}
            >
              Learn more
            </a>{" "}
            <span>&nbsp;</span> about how to install and set up Android SDK.
          </div>
          {this.state.saving ? (
            <>
              <br />
              <div className="animated-background timeline-item" /> <br />
              <div className="animated-background timeline-item" /> <br />
              <div className="animated-background timeline-item" /> <br />
              <div className="animated-background timeline-item" />
            </>
          ) : (
              <>
                {this.state.showSettingsForm
                  ? this.getAppSettingsForm()
                  : this.getAddAndroidAppBlock()}
              </>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  };
};

const mapDispatchToProps = {
  updateApplicationRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(AndroidAppSettings);
