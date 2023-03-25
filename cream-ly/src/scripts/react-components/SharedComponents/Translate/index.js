import React from "react";
import { translate } from "@Core/i18n";
import { connect } from "@Components/index";

@translate({}, "common")
class TranslateComponent extends React.Component {
  getTranslationKey() {
    if (this.props.key) return this.props.key;
    return this.props.children;
  }

  render() {
    const translation = this.t(this.getTranslationKey()).replaceAll(
      /\n|\r/g,
      "<br/>"
    );
    return <div dangerouslySetInnerHTML={{ __html: translation }}></div>;
  }
}

export default connect((state, ownProps) => {
  console.log("connect ownProps", ownProps);
  return {};
})(TranslateComponent);
