import React from "react";
import Slider from "react-slick";
import styles from "./styles.module.scss";

const data = [
  {
    description:
      "With real-time integrated data flows from Apphud, we can truly understand what people are doing with our platform.",
    author: "Denis Sevastyanov",
    role: "Chief Marketing Officer at PREQUEL",
    img1: "",
    img2: "",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.testimonials}>
      <div className="container">
        <h2>
          Trusted by hundreds of startups and large <br /> mobile-first
          companies
        </h2>

        <Slider {...settings} className={styles.slider}>
          {Array.from(new Array(12))
            .fill(data[0])
            .map((e, i) => (
              <div className={styles.slide} key={i}>
                <div className={styles.item}>
                  <p>{e.description}</p>
                  <div className={styles.author}>
                    <div className={styles.images}>
                      <div />
                      <div />
                    </div>

                    <div className={styles.content}>
                      <label className="h4">{e.author}</label>
                      <span>{e.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
