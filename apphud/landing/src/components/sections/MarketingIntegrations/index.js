import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const MarketingIntegrations = () => {
  return (
    <div className={styles.integrations}>
      <div className={cn("container", styles.container)}>
        <label className="h4">
          Integrations with popular product analytics and marketing platforms
        </label>
        <img
          className={styles.image1Big}
          src={require("./integrations.svg")}
          alt="Integrations"
          style={{ objectFit: "contain" }}
        />
        <img
          className={styles.image1Small}
          src={require("./integrations-small.svg")}
          alt="Integrations"
          style={{ objectFit: "contain" }}
        />
        <p className="text_xl">
          Apphud integrates with top analytics and marketing platforms like
          Amplitude, Mixpanel, Facebook, AppsFlyer, Branch, Adjust, Tenjin,
          AppMetrica.
        </p>
      </div>
      <div className="container container_xs">
        <img
          className={styles.image2Big}
          src={require("./settings.svg")}
          alt="Settings"
          style={{ objectFit: "contain" }}
        />
        <img
          className={styles.image2Small}
          src={require("./settings-small.svg")}
          alt="Settings"
          style={{ objectFit: "contain" }}
        />
        <p className="text_xl">
          You can easily pass all subscription-based events and make right
          product decisions. No additional coding required.
        </p>
      </div>
    </div>
  );
};

export default MarketingIntegrations;
