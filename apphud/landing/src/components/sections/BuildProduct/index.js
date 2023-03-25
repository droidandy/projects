import React from "react";
import styles from "./styles.module.scss";

const data = [
  {
    id: "1",
    title: "Detailed user page",
    description:
      "Customer’s subscriptions, spent amount, properties and attribution data.",
    icon: require("./icons/user.svg"),
  },

  {
    id: "3",
    title: "Automatic currency conversion",
    description:
      "Apphud converts all transactions from user’s local currency into USD.",
    icon: require("./icons/conversion.svg"),
  },

  {
    id: "4",
    title: "Analyze data in a real time",
    description:
      "All metrics, like revenue, MRR and conversions are being updated in a real time.",
    icon: require("./icons/time.svg"),
  },

  {
    id: "6",
    title: "Build screens in a Visual Editor",
    description:
      "Create paywalls, offer screens and surveys using powerful visual editor. No coding required.",
    icon: require("./icons/visual.svg"),
  },

  {
    id: "5",
    title: "Keep existing infrastructure if you want",
    description:
      "You can use Apphud together with existing flow – purchases through Apphud SDK are optional.",
    icon: require("./icons/inf.svg"),
  },

  {
    id: "9",
    title: "Free for startups",
    description:
      "Key features available on a Free plan. Apphud is free if app revenue is less than $10,000 per month.",
    icon: require("./icons/rocket.svg"),
  },

  {
    id: "7",
    title: "Invite your teammates",
    description:
      "All metrics, like revenue, MRR and conversions are being updated in a real time.",
    icon: require("./icons/team.svg"),
  },

  {
    id: "8",
    title: "Server-to-server webhooks",
    description:
      "Send subscription events to your server. Useful if you have in-house analytics or custom logics.",
    icon: require("./icons/server.svg"),
  },

  {
    id: "2",
    title: "Remotely manage products on paywalls",
    description:
      "Change in-app purchases available to your users on the go without App Store review.",
    icon: require("./icons/remote.svg"),
    soon: true,
  },
];

const BuildProduct = () => {
  return (
    <div className={styles.build}>
      <div className="container">
        <h2>
          Build a better product. <br /> Rely in-app subscription infrastructure
          on us
        </h2>
        <div className={styles.list}>
          {data.map((e, i) => (
            <div className={styles.item} key={i}>
              <img src={e.icon} alt={e.title} />
              <label className="subheader-large h4">{e.title}</label>
              <p className="text text_xl">{e.description}</p>
              {e.soon && <span>soon</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildProduct;
