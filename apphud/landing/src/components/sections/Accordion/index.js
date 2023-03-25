import React from "react";
import { useSpring, animated } from "react-spring";
import styles from "./styles.module.scss";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  const showBlock = useSpring(
    open
      ? {
          maxHeight: "1000px",
          opacity: 1,
          transform: "translateY(0)",
          delay: 0,
        }
      : {
          opacity: 0,
          transform: "translateY(-20px)",
          delay: 30,
          maxHeight: "0px",
        }
  );
  return (
    <div className={styles.accordion} itemscope="" itemtype="https://schema.org/Question">
      <div
        className={`${styles.title} ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        itemprop="name"
      >
        {title}
      </div>
      <animated.div style={showBlock} className={styles.item}>
        <div className={styles.content} itemprop="acceptedAnswer" itemscope="" itemtype="http://schema.org/Answer">
            <span itemprop="text">{children}</span>
        </div>
      </animated.div>
    </div>
  );
};

export default Accordion;
