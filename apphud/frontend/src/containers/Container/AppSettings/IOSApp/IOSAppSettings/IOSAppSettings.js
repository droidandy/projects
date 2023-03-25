import React, { Component } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { SingleDatePicker, DayPickerRangeController } from "react-dates";
import moment from "moment";
import { IoTrash } from "react-icons/io5";

import Input from "../../../../../components/Input";
import SubscriptionCertificateUploader from "../../../../Common/SubscriptionCertificateUploader";
import { NotificationManager } from "../../../../../libs/Notifications";
import {
  updateApplicationRequest,
  fetchApplicationRequest
} from "../../../../../actions/application";
import { fetchApplicationsRequest } from "../../../../../actions/applications";
import {track, validation} from "../../../../../libs/helpers";

import titleIcon from "../../../../../assets/images/icons/title-icon.svg";
import featherIcon from "../../../../../assets/images/icons/feather-icon.svg";
import iosAppAddImage from "../../../../../assets/images/ios-app-add.svg";
import styles from "./styles.module.scss";
import plantSvg from "./plant.svg";
import Tip from "../../../../Common/Tip";

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

const AppleSmallBusinessProgramTip = () => {
  return (
    <>
      <p className={styles.tip}>
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

function isBeforeDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;

  const aYear = a.year();
  const aMonth = a.month();

  const bYear = b.year();
  const bMonth = b.month();

  const isSameYear = aYear === bYear;
  const isSameMonth = aMonth === bMonth;

  if (isSameYear && isSameMonth) return a.date() < b.date();
  if (isSameYear) return aMonth < bMonth;
  return aYear < bYear;
}

const isInclusivelyAfterDay = (a, b) => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return !isBeforeDay(a, b);
};

class IOSAppSettings extends Component {
  state = {
    fields: {
      bundle_id: "",
      appstore_app_id: 0,
      appstore_shared_secret: "",
      apple_webhook_received_at: "",
      appstore_notifications_proxy_url: "",
      appstore_notifications_url: ""
    },
    updateSubmitted: false,
    showSettingsForm: false,
    loading: false,
    dateStart: null,
    dateEnd: null,
    focusedFirst: false,
    focusedSecond: false
  };

  componentDidMount() {
    this.getApp();
    document.title = "Apphud | iOS app settings";
    const {
      bundle_id,
      appstore_app_id,
      appstore_shared_secret,
      apple_webhook_received_at,
      appstore_notifications_proxy_url,
      appstore_notifications_url,
      sbp_end_date,
      sbp_start_date
    } = this.props.application;

    this.setState({
      dateStart: sbp_start_date ? moment(sbp_start_date) : null,
      dateEnd: sbp_end_date ? moment(sbp_end_date) : null,
      fields: {
        bundle_id,
        appstore_app_id,
        appstore_shared_secret,
        apple_webhook_received_at,
        appstore_notifications_proxy_url,
        appstore_notifications_url
      }
    });
  }

  getApp = (props = this.props) => {
    const fields = this.state.fields;

    const { application } = this.props;

    this.setState({
      fields: {
        ...fields,
        ...application
      },
      showSettingsForm: Boolean(application.bundle_id),
      loading: false
    });
  };

  removeCertificate = () => {
    this.props.updateApplicationRequest(
      {
        id: this.props.match.params.appId,
        apple_subscription_key: ""
      },
      () => {
        this.props.fetchApplicationRequest(this.props.match.params.appId);
      },
      () => { },
      true
    );
  };

  onFieldChange = (field, value) => {
    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        [field]: field === "appstore_app_id" ? Number(value) : value
      }
    });
  };

  getIsRequiredError = (field) => {
    const invalid = this.state.updateSubmitted && !this.state.fields[field];

    return invalid ? [field] : [];
  };

  getSharedSecretErrors = (field) => {
    const invalid =
      this.state.fields[field] &&
      this.state.updateSubmitted &&
      !validation(this.state.fields[field], "appstore_shared_secret");

    return invalid ? [field] : [];
  };

  getProxyErrors = (field) => {
    const invalid =
      this.state.updateSubmitted &&
      this.state.fields[field] &&
      !validation(this.state.fields[field], "url");
    return invalid ? [field] : [];
  };

  onEnablePlatformButtonClick = () => {
    this.setState({
      showSettingsForm: true
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ updateSubmitted: true });

    const {
      bundle_id,
      appstore_app_id,
      appstore_notifications_proxy_url
    } = this.state.fields;

    if (
      validation(appstore_notifications_proxy_url, "url") &&
      bundle_id &&
      appstore_app_id &&
      !this.getSharedSecretErrors("appstore_shared_secret").length
    ) {
      const params = {
        ...this.state.application,
        ...this.state.fields,
        id: this.props.match.params.appId,
        sbp_start_date: this.state.dateStart
          ? moment(this.state.dateStart).format("YYYY-MM-DD")
          : "",
        sbp_end_date: this.state.dateEnd
          ? moment(this.state.dateEnd).format("YYYY-MM-DD")
          : ""
      };

      this.setState({ loading: true }, () => {
        this.props.updateApplicationRequest(
          params,
          (app) => {
            this.setState({ updateSubmitted: false, loading: false });
            this.props.fetchApplicationsRequest();
            NotificationManager.success("App successfully saved", "OK", 5000);
            track("ios_app_settings_saved", app);
          },
          (e) => {
            NotificationManager.error(`Error ${e}`, "OK", 5000);
            this.setState({ loading: false });
          }
        );
      });
    }
  };

  getSettingsForm = () => {
    const {
      fields: {
        bundle_id,
        appstore_app_id,
        appstore_shared_secret,
        apple_webhook_received_at,
        appstore_notifications_url,
        appstore_notifications_proxy_url
      }
    } = this.state;

    return (
      <div className="appsettings-container__form">
        <Input
          label={"Bundle ID"}
          value={bundle_id}
          onChange={({ value }) => this.onFieldChange("bundle_id", value.trim())}
          type={"text"}
          id="bundle_id"
          name="bundle_id"
          required={true}
          errors={this.getIsRequiredError("bundle_id")}
          placeholder="com.company.app"
          autoComplete="off"
        />
        <Input
          label={"App Store app ID"}
          value={appstore_app_id || ""}
          onChange={({ value }) => this.onFieldChange("appstore_app_id", value.trim())}
          type={"number"}
          id="appstore_app_id"
          name="appstore_app_id"
          required={true}
          errors={this.getIsRequiredError("appstore_app_id")}
          placeholder="App ID without “id” prefix, e.g.: 123456789"
          bottomText={
            <>
              {" "}
              It can be found in{" "}
              <a
                onClick={() => track("ios_app_settings_app_store_id_link_clicked")}
                href="https://appstoreconnect.apple.com"
                target="_blank"
                className="link"
              >
                App Store Connect
              </a>{" "}
            </>
          }
        />
        <Input
          label={"App Store shared secret"}
          value={appstore_shared_secret || ""}
          onChange={({ value }) =>
            this.onFieldChange("appstore_shared_secret", value.trim())
          }
          type={"text"}
          id="appstore_shared_secret"
          name="appstore_shared_secret"
          required={true}
          errors={this.getSharedSecretErrors("appstore_shared_secret")}
          placeholder="Shared secret"
          showHideButton={true}
          autoComplete="new-password"
          bottomText={
            <>
              <a
                onClick={() => track("ios_app_settings_shared_secret_link_clicked")}
                href="https://docs.apphud.com/getting-started/creating-app#app-store-shared-secret"
                target="_blank"
                className="link"
              >
                Learn more
              </a>{" "}
              about how to get App Store shared secret
            </>
          }
        />
        <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
          <img src={titleIcon} alt="titleIcon" />
          <span>URL for App Store Server Notifications</span>
        </div>
        <Input
          label="URL for App Store Server Notifications"
          value={appstore_notifications_url}
          type={"text"}
          id="appstore_notifications_url"
          name="appstore_notifications_url"
          placeholder="App name"
          readOnly={true}
          copyButton={true}
          bottomText={
            <>
              Paste this URL into "URL for App Store Server Notifications" field
              in App Store Connect{" "}
              <a
                onClick={()=> track("ios_app_settings_server_notifications_link_clicked")}
                href="https://docs.apphud.com/getting-started/creating-app#url-for-app-store-server-notifications"
                target="_blank"
                className="link"
              >
                Learn more.
              </a>
            </>
          }
          rightLabel={
            apple_webhook_received_at ? (
              <span>
                Last received at&nbsp;
                <Moment
                  className="uppercase"
                  format="MMM DD, HH:mm"
                  date={apple_webhook_received_at}
                />
              </span>
            ) : (
                "Never received"
              )
          }
        />
        <Input
          label={"Proxy App Store server notifications to this URL"}
          value={appstore_notifications_proxy_url || ""}
          onChange={({ value }) =>
            this.onFieldChange("appstore_notifications_proxy_url", value)
          }
          type={"text"}
          id="appstore_notifications_proxy_url"
          name="appstore_notifications_proxy_url"
          errors={this.getProxyErrors("appstore_notifications_proxy_url")}
          placeholder="https://example.com"
          bottomText={
            "Proxy App Store server notifications to custom URL. For example, if you have own logics in your server."
          }
        />
        <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
          <img src={featherIcon} alt="featherIcon" />
          <span>Signature for subscription offers</span>
        </div>
        <SubscriptionCertificateUploader
          currentValue={this.props.application.apple_subscription_key}
          subtitle="Subscription key file"
          data="apple_subscription_key"
          keyIdProp="apple_subscription_key_id"
          removeFunc={this.removeCertificate}
          forceUpload={true}
          url={`/apps/${this.props.match.params.appId}`}
          tip={{
            title: "Subscription key ID",
            description:
              'A string that identifies the private key you use to generate the signature. You can find this identifier in App Store Connect <a href="https://appstoreconnect.apple.com/access/api/subs" target="_blank" class="link">Users and Access > Keys</a>, in the KEY ID column for the subscription key you generated.',
            buttonUrl: "https://appstoreconnect.apple.com/access/api/subs"
          }}
        />
        <div className="warning">
          Important: Do not rename subscription key file when uploading.
        </div>

        <div className={styles["small-program"]}>
          <div className="container-content__integrations-settings__content-title container-content__integrations-settings__content-title_uploader">
            <img src={plantSvg} alt="plantIcon" />
            <span>
              Apple Small Business Program
              {!this.state.dateStart && (
                <Tip description={<AppleSmallBusinessProgramTip />}>
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
                const need = moment(new Date(2021, 0));
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
              Entry date is effective date of entry the program. Must be Jan 1,
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
                const need = moment(new Date(2021, 0));
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
                onClick={() => track("ios_app_settings_small_business_program_link_clicked")}
                href="https://docs.apphud.com/other/app-store-small-business-program"
                target="_blank">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  getAddIOSAppBlock = () => {
    return (
      <div className="container-content--integrations-no-webhooks">
        <div style={{ width: "290px", height: "320px" }}>
          <img src={iosAppAddImage} alt="iosAppAddImage" />
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
            The easiest way to handle in-app subscriptions in your iOS app
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
            <span className="va-middle text-black">iOS app settings</span>
          </div>
          {this.state.showSettingsForm && (
            <button
              onClick={this.handleSubmit}
              className="button button_green l-p__button fr mt0"
              disabled={this.state.loading}
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
              onClick={() => track("ios_app_settings_learn_more_link_clicked")}
            >
              Learn more
            </a>{" "}
            &nbsp; about how to install and set up iOS SDK.
          </div>
          {this.state.loading ? (
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
                  ? this.getSettingsForm()
                  : this.getAddIOSAppBlock()}
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
  updateApplicationRequest,
  fetchApplicationRequest,
  fetchApplicationsRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(IOSAppSettings);
