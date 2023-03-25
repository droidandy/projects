import React, { Component } from "react";
import Header from "@Components/Structure/Header";
import "./index.scss";
import { translate } from "@Core/i18n";
import PropTypes from "prop-types";
import Button from "@Components/Structure/Button";
@translate({ feedbacksTitle: "Отзывы о {{product}}" }, "common")
class ProductFeedback extends Component {
  state = {
    feedbacks: [],
  };
  componentDidMount() {
    this.setState({
      feedbacks: this.props.feedbacks.slice(0, this.props.limit),
    });
  }

  handleClick = () => {
    this.setState({
      feedbacks: this.props.feedbacks,
    });
  };
  render() {
    const { product = {}, title } = this.props;

    if (
      !Array.isArray(this.props.feedbacks) ||
      this.props.feedbacks.length == 0
    )
      return null;

    return (
      <div className="ProductFeedback">
        {!Boolean(this.props.noHeader) && (
          <div className="contentBox">
            <Header
              text={this.t("feedbacksTitle", {
                product: title || product.title,
              })}
            />
          </div>
        )}
        {this.state.feedbacks.map((feedback, index) => {
          return (
            <>
              <div key={index} className="bubbles">
                <>
                  <div
                    className={`talk-bubble ${index % 2 ? "right" : "left"}-in`}
                  >
                    {feedback}
                  </div>
                  <div className="clear fix"></div>{" "}
                </>
              </div>
            </>
          );
        })}
        {this.props.feedbacks.length !== this.state.feedbacks.length && (
          <Button
            onClick={this.handleClick}
            text={this.t("common:feedbacks.buttonShowMore")}
          />
        )}
      </div>
    );
  }
}

ProductFeedback.propTypes = {
  product: PropTypes.object,
  feedbacks: PropTypes.func,
};

ProductFeedback.defaultProps = {
  limit: 3,
};

export default ProductFeedback;
