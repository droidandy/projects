import React from "react";
import { useRouter } from "next/router";
import Button from "components/UI/Button";
import Link from "next/link";
import styles from "./styles.module.scss";

const Plan = () => {
  const router = useRouter();

  return (
    <div className="container">
      <div className={styles.plan}>
        <div className={styles.wrapper}>
          <div>
            <h2>Enterprise plan</h2>
            <p>
              Earning more than $100,000 per month?
              <br />
              Contact us and we will offer a special price to you.
            </p>
            <div className={styles.btns}>
              <Button
                title="Contact us"
                onClick={() => {
                  router.push("/contact");
                }}
              />
            </div>
          </div>

          <div>
            <img src={require("./box.svg")} alt="Enterprise plan" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
