import React from "react";
import PropTypes from "prop-types";
import { connect } from "@Components/index";

import * as Router from "@Core/app/router";

import "./index.scss";

class PageLink extends React.Component {
  static propTypes = {
    pageType: PropTypes.oneOf(Object.values(Router.PAGES)).isRequired,
    pageOptions: PropTypes.object,
    dataTest: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  handleOnClick(event) {
    if (this.props.isLoading) return;
    if (typeof this.props.onClick === "function") {
      event.preventDefault();
      this.props.onClick(event);
    }
  }
  render() {
    const className = "PageLink";

    //console.log("PageLink", this.props);

    const options = {
      className: this.props.className
        ? `${this.props.className} ${className}`
        : className,
      href: this.getHref(),
    };

    if (this.props.dataTest) options["data-test"] = this.props.dataTest;

    if (!this.props.children && this.props.text)
      options.dangerouslySetInnerHTML = { __html: this.props.text };

    return (
      <a {...options} onClick={this.handleOnClick.bind(this)}>
        {this.props.children}
      </a>
    );
  }

  getHref() {
    if (this.props.pageType == "PAGE_QUIZ_OR_RESULTS") {
      return this.props.quizURL;
    }

    if (this.props.pageType && !this.props.href) {
      const pageOptions =
        typeof this.props.pageOptions === "object" &&
        this.props.pageOptions != null
          ? this.props.pageOptions
          : this.props;

      return Router.getURLForPage(this.props.pageType, pageOptions);
    }

    return this.props.href;
  }
}

const mapStateToProps = (state, ownProps) => {
  return { quizURL: ownProps.quizURL ? ownProps.quizURL : state.quiz.url };
};

export default connect(mapStateToProps)(PageLink);
