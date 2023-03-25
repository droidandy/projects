import React from "react";
import Header from "@Components/Structure/Header";
import { Carousel } from "react-responsive-carousel";
import { translate } from "@Core/i18n";
import "./Feedbacks.scss";

@translate()
export default class Feedbacks extends React.Component {
  render() {
    const list = this.props.list;
    if (!list || !Array.isArray(list) || !list.length > 0) return null;

    return (
      <div className="componentFeedbacks" data-test="feedbacks-component">
        <Header
          text={this.t("common:feedbacksTitle", { product: this.props.title })}
        />
        <div className="row">
          <div className="carousel-video col-12 text align-self-center">
            <Carousel showThumbs={false}>
              {list.map((feedback, index) => (
                <div
                  className="innerSlide align-self-center"
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: `<div class="innerSlide_padding">${feedback.replace(
                      /(?:\r\n|\r|\n)/g,
                      "<br/>"
                    )}</div>`,
                  }}
                />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}
