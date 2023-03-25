import React from "react";
import cn from "classnames";
import Button from "components/UI/Button";
import Details from "./Details";
import styles from "./styles.module.scss";

const free = [
  {
    id: "1",
    description: "Integrate and handle cross-platform in-app subscriptions",
  },
  {
    id: "2",
    description: "Validate App Store and Google Play receipts ",
  },
  {
    id: "3",
    description: "Implement subscription offers with no server code",
  },
  {
    id: "4",
    description: "Revenue analytics",
  },
  {
    id: "5",
    description: "Understand why customers cancel subscriptions",
  },
  {
    id: "6",
    description: "Run A/B experiments to test different in-app purchase prices",
    soon: true,
  },
];

const launch = [
  {
    id: "1",
    description: "Integrate and handle cross-platform in-app subscriptions",
  },
  {
    id: "2",
    description: "Validate App Store and Google Play receipts ",
  },
  {
    id: "3",
    description: "Implement subscription offers with no server code",
  },
  {
    id: "4",
    description: "Revenue analytics",
  },
  {
    id: "5",
    description: "Understand why customers cancel subscriptions",
  },
  {
    id: "6",
    description: "Run A/B experiments to test different in-app purchase prices",
    soon: true,
  },
];

const grow = [
  {
    id: "1",
    description: "Integrate and handle cross-platform in-app subscriptions",
  },
  {
    id: "2",
    description: "Validate App Store and Google Play receipts ",
  },
  {
    id: "3",
    description: "Implement subscription offers with no server code",
  },
  {
    id: "4",
    description: "Revenue analytics",
  },
  {
    id: "5",
    description: "Understand why customers cancel subscriptions",
  },
  {
    id: "6",
    description: "Run A/B experiments to test different in-app purchase prices",
    soon: true,
  },
];

const Pricing = () => {
  return (
    <div className={styles.pricing}>
      <div className="container">
        <div className={styles.items}>
          <div className={styles.item}>
            <div className={styles.wrap}>
              <p>Free</p>
              <div>
                <span>$</span>
                <span>0</span>
                <span>/month</span>
              </div>
              <img src={require("./icons/free.svg")} alt="Free plan" />
              <div>
                <span>Receipt Validation</span>
                <span>Realtime subscription analytics</span>
                <span>Cohorts and conversions charts</span>
                <span>All integrations</span>
                <span>Fast support in online chat</span>
                <span>1 Сollaborator</span>
                <span>Includes $10,000 MTR</span>
              </div>
              <a href="https://app.apphud.com/sign_up">
                <Button title="Get started" transparent border />
              </a>

              <Details items={free} />
            </div>
          </div>

          <div className={cn(styles.item, "mark")}>
            <div className={styles.wrap}>
              <p>Launch</p>
              <div>
                <span>$</span>
                <span>199</span>
                <span>/month</span>
              </div>
              <img src={require("./icons/launch.svg")} alt="Launch plan" />
              <div>
                <span>Everything in free plan plus:</span>
                <span>Unlimited Collaborators</span>
                <span>Server-to-server webhooks</span>
                <span>Customers REST API</span>
                <span>Includes $25,000 MTR</span>
              </div>
              <a href="https://app.apphud.com/sign_up">
                <Button title="Choose plan" />
              </a>
              <Details items={launch} />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.wrap}>
              <p>Grow</p>
              <div>
                <span>$</span>
                <span>499</span>
                <span>/month</span>
              </div>
              <img src={require("./icons/grow.svg")} alt="Grow plan" />
              <div>
                <span>Everything in Launch plan plus:</span>
                <span>Raw data exports</span>
                <span>Includes $100,000 MTR</span>
              </div>
              <a href="https://app.apphud.com/sign_up">
                <Button title="Choose plan" />
              </a>

              <Details items={grow} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
