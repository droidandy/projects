import React, { useState, useMemo } from "react";
import cn from "classnames";
import Slider from "react-slick";
import styles from "./styles.module.scss";

const Tabs = ({ children, nav }) => {
  const [tab, setTab] = useState(0);
  const elements = useMemo(() => React.Children.toArray(children), [children]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div
        style={{
          borderRadius: "0",
          padding: "0",
          marginTop: "32px",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "#DFE5EB",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
      />
    ),
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.header}>
        {nav.map((e, i) => (
          <button
            type="button"
            onClick={() => setTab(i)}
            key={i}
            className={cn({ _active: i === tab })}
          >
            {e}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {elements.map((e, i) => (
          <div className={cn({ _active: i === tab }, styles.tab)} key={i}>
            {e}
          </div>
        ))}
      </div>

      <div className={styles.laptop}>
        <Slider {...settings} className={styles.slider}>
          {elements.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Tabs;
