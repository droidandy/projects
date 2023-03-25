import React, { useState } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const nav = [
  {
    icon: "/icons/companies/apple.svg",
    soon: false,
    link: "https://docs.apphud.com/getting-started/sdk-integration/ios",
    rel: "nofollow"
  },
  {
    icon: "/icons/companies/android.svg",
    soon: false,
    link: "https://docs.apphud.com/getting-started/sdk-integration/android",
    rel: "nofollow"
  },
  {
    icon: "/icons/companies/flutter.svg",
    soon: false,
    rel: "nofollow",
    link: "https://docs.apphud.com/getting-started/sdk-integration/flutter",
  },
  // {
  //   icon: "/icons/companies/unity.svg",
  //   soon: false,
  // },
  {
    icon: "/icons/companies/react.svg",
    soon: true,
  },

  // {
  //   icon: "/icons/companies/stripe.svg",
  //   soon: false,
  // },
];

const Tab1 = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <div className={styles.content}>
        <label className="subheader-medium h4">
          The easiest way to integrate in-app subscriptions
        </label>
        <p className="text text_xl">
          Apphud provides ready-to-use infrastructure for all kinds of in-app
          purchases. Integrate Apphud SDK and implement 2 lines of code.
        </p>
        <a href="/development" className="link">
          Learn about Apphud for development
        </a>
      </div>

      <div className={styles.tabs}>
        <div className={styles.imgs}>
          <img src={require("../images/star-ball.svg")} />
        </div>

        <div className={styles.code}>
          <div className="code">
            <span>Apphud.</span>
            <span className="c-met">start</span>
            <span>(apiKey: "api_key")</span>
            <br />
            <span>Apphud.</span>
            <span className="c-met">purchase</span>
            <span>{`(product) { result in`}</span>
            <br />
            <span className="c-com">{`     // handle result`}</span>
            <br />
            <span>{`})`}</span>
          </div>
        </div>

        <div className={styles.nav}>
          {nav.map((e, i) => (
            <a href={e.link} key={i} className={cn({ _soon: e.soon })} rel={e?.rel}>
              <img src={e.icon} />
              {e.soon && <span>soon</span>}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tab1;
