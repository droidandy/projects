import React from "react";
import styles from "./styles.module.scss";

const ContactLinks = ({ items }) => {
  return (
    <div className={styles.links}>
      <div className="container">
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.link}>
              <img
                src={`/icons/contact/chat.svg`}
                alt="Chat with us"
                className="open-chat"
              />
              <p className="open-chat">Chat with us</p>
            </div>

            <div className={styles.status}>
              <span className={styles.text}>We are online</span>
              <span className={styles.indicator}></span>
            </div>
          </div>

          <div className={styles.item}>
            <a
              className={styles.link}
              href="mailto:support@apphud.com?subject=Apphud support&body="
            >
              <img src={`/icons/contact/email.svg`} alt="Email to us" />
              <p>Email to us</p>
            </a>
          </div>

          <div className={styles.item}>
            <a className={styles.link} href="https://docs.apphud.com">
              <img src={`/icons/contact/docs.svg`} alt="Read the docs" />
              <p>Read the docs</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactLinks;
