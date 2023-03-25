import React from "react";
import cn from "classnames";
import IntegrationLinks from "components/sections/IntegrationLinks";
import styles from "./styles.module.scss";

const IntegrationGrid = () => {
  return (
    <div className={cn(styles.grid)}>
      <div className="container">
        <div className={cn(styles.row)}>
          <IntegrationLinks
            links={
              <>
                <a href="/integrations/amplitude">
                  <img src="icons/integrations/amplitude.svg" alt="amplitude" />
                  <div>Amplitude</div>
                </a>
                <a href="/integrations/mixpanel">
                  <img src="icons/integrations/mixpanel.svg" alt="mixpanel" />
                  <div>Mixpanel</div>
                </a>
                <a href="/integrations/facebook">
                  <img src="icons/integrations/facebook.svg" alt="facebook" />
                  <div>Facebook</div>
                </a>
                <a href="/integrations/firebase">
                  <img src="icons/integrations/firebase.svg" alt="firebase" />
                  <div>Firebase</div>
                </a>
              </>
            }
            text={
              "Send subscription events, like trial activations, renewals, cancellations and others to Amplitude, Mixpanel, Facebook Ads Manager and Facebook Analytics."
            }
          />

          <IntegrationLinks
            links={
              <>
                <a href="/integrations/slack">
                  <img src="icons/integrations/slack.svg" alt="slack" />
                  <div>Slack</div>
                </a>
                <a href="/integrations/telegram">
                  <img src="icons/integrations/telegram.svg" alt="telegram" />
                  <div>Telegram</div>
                </a>
              </>
            }
            text={
              "Get instantly notified when user starts trial, cancels subscription, gets billed, makes a refund and so on."
            }
          />
        </div>

        <div className={cn(styles.row)}>
          <IntegrationLinks
            links={
              <>
                <a href="/integrations/appsflyer">
                  <img src="icons/integrations/appsflyer.svg" alt="appsflyer" />
                  <div>AppsFlyer</div>
                </a>
                <a href="/integrations/branch">
                  <img src="icons/integrations/branch.svg" alt="branch" />
                  <div>Branch</div>
                </a>
                <a href="/integrations/adjust">
                  <img src="icons/integrations/adjust.svg" alt="adjust" />
                  <div>Adjust</div>
                </a>
                <a href="/integrations/tenjin">
                  <img src="icons/integrations/tenjin.svg" alt="tenjin" />
                  <div>Tenjin</div>
                </a>
                <a href="/integrations/appmetrica">
                  <img
                    src="icons/integrations/appmetrica.svg"
                    alt="appmetrica"
                  />
                  <div>AppMetrica</div>
                </a>
              </>
            }
            text={
              "Send subscription events, like trial activations, renewals, cancellations and others. Receive attribution info from AppsFlyer, Branch, Adjust, Tenjin, AppMetrica to Apphud."
            }
          />
        </div>

        <div className={cn(styles.row)}>
          <IntegrationLinks
            links={
              <a href="/integrations/webhooks">
                <img src="icons/integrations/webhooks.svg" alt="webhooks" />
                <div>Webhooks</div>
              </a>
            }
            text={
              "Send subscription events, like trial activations, renewals, cancellations and others to own server."
            }
          />
          <IntegrationLinks
            links={
              <a href="/integrations/apple-search-ads">
                <img src="icons/integrations/apple.svg" alt="apple" />
                <div>Apple Search Ads</div>
              </a>
            }
            text={"Analyze efficiency of your Apple Search Ads campaigns."}
          />
          <IntegrationLinks
            links={
              <a href="/integrations/onesignal">
                <img src="icons/integrations/onesignal.svg" alt="onesignal" />
                <div>OneSignal</div>
              </a>
            }
            text={
              "Send push notifications based on subscription events via OneSignal."
            }
          />
          <IntegrationLinks
            links={
              <a href="/integrations/segment">
                <img src="icons/integrations/segment.svg" alt="segment" />
                <div>Segment</div>
              </a>
            }
            text={
              "Send subscription events, like trial activations, renewals, cancellations and others to Segment"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationGrid;
