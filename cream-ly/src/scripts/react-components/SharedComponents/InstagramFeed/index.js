import React, { Component } from "react";
import i18next from "i18next";

import * as elfsight from "@elfsight/embed-sdk";

import Header from "@Components/Structure/Header";
import "./index.scss";

import { translate } from "@Core/i18n";

import PropTypes from "prop-types";

const widgetIdInstagramFeedback = "136059dd-4402-4da4-913a-451253f44a5c";

@translate(
  {
    title:
      "НОВОСТИ {{linebrake.mobile}} ИЗ <a href='http://instagram.com/cream.ly' target='_blank'>@cream.ly</a> Instagram",
    instagram: {
      link:
        '<a href="$t(InstagramFeedback:instagram.url)" target="_blank">@cream.ly</a>',
      url: "http://instagram.com/cream.ly",
    },
  },
  "InstagramFeed"
)
class InstagramFeedback extends Component {
  constructor(props) {
    super(props);
    this.widgetContainter = React.createRef();
  }

  componentDidMount() {
    if (this.props.lang != "ru") return;

    const container = this.widgetContainter.current;
    elfsight.ElfsightEmbedSDK.displayWidget(
      container,
      widgetIdInstagramFeedback
    );
  }

  render() {
    if (this.props.lang != "ru") return null;

    return (
      <div className="InstagramFeedback spacingBottom">
        <Header text={this.t("title")} />
        <div ref={this.widgetContainter} />
      </div>
    );
  }
}
InstagramFeedback.defaultProps = {
  lang: "ru",
};
export default InstagramFeedback;

InstagramFeedback.propTypes = {
  lang: PropTypes.string,
};
