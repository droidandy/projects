import React from "react";
import cn from "classnames";
import Button from "components/UI/Button";
import styles from "./styles.module.scss";
import {AnimationHome} from "../../Animation";

const Main = ({
  title,
  description,
  content = null,
  long = false,
  absolute = false,
  mainLong = false,
  withBtns = false,
}) => {
  return (
    <div className={styles.main}>
      <div className="container">
        <div className={styles.row}>
          <div
            className={cn(styles.content, { long, ["main-long"]: mainLong })}
          >
            <h1>{title}</h1>
            <p className="text_xl">{description}</p>
            {withBtns && (
              <div className={styles.btns}>
                <a rel="nofollow" href="https://app.apphud.com/sign_up">
                  <Button title="Start for Free" />
                </a>
                <Button title="Talk to us" transparent className="open-chat" />
              </div>
            )}
          </div>
          <div className={cn(styles.image, { absolute, ["main-long"]: mainLong })}>
            {content || <AnimationHome />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
