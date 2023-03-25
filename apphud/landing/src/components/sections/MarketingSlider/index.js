import React from "react";
import cn from "classnames";
import Slider from "react-slick";
import styles from "./styles.module.scss";
import {AnimationChart} from "../../Animation";

const MarketingSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={cn(styles.slider)}>
      <div className="container container_sm">
        <h2>View key metrics of your business</h2>
        <label className="h4">Monthly Recurring Revenue</label>

        <Slider {...settings} className={styles.slick}>
          <div className={styles.slide}>
            <AnimationChart />
          </div>
          <div className={styles.slide}>
            <img
              className={styles.imageBig}
              src={require("./image2.svg")}
              alt="metrics"
            />
            <img
              className={styles.imageSmall}
              src={require("./image2-small.svg")}
              alt="metrics"
            />
          </div>
          <div className={styles.slide}>
            <img
              className={styles.imageBig}
              src={require("./image3.svg")}
              alt="user information"
            />
            <img
              className={styles.imageSmall}
              src={require("./image3-small.svg")}
              alt="user information"
            />
          </div>
        </Slider>
        <p className="text_xl">
          Analyze your app MRR and revenue across marketing channels, countries,
          products. View information about each user, including purchases
          history and attribution channel.
        </p>
      </div>
    </div>
  );
};

export default MarketingSlider;
