import React from "react";
import cn from "classnames";
import Slider from "react-slick";
import styles from "./styles.module.scss";

const ProductSlider = () => {
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="container">
      <div className={cn(styles.slider)}>
        <div className={cn(styles.text)}>
          <label className="h4">Win back lapsed subscribers</label>
          <p className="text_xl">
            Create rules to win back lapsed customers by providing them a
            discount.
            <br /> Create purchase screens in our editor. No additional coding
            required.
          </p>
        </div>
        <div className={cn(styles.wrapper)}>
          <Slider {...settings} className={styles.slick}>
            <div className={styles.slide}>
              <img src={require("./image1.svg")} alt="chart" />
              <p>When a user cancels trial or subscription...</p>
            </div>
            <div className={styles.slide}>
              <img src={require("./image2.svg")} alt="metrics" />
              <p>...we will ask a user to pass the survey</p>
            </div>
            <div className={styles.slide}>
              <img src={require("./image3.svg")} alt="user information" />
              <p>If the subscription was too expensive to a user...</p>
            </div>
            <div className={styles.slide}>
              <img src={require("./image4.svg")} alt="user information" />
              <p>...we’ll offer a discount or new trial to win him back</p>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
