import React, { Component } from "react";
import { Liquid } from "liquidjs";
const path = require("path");

//import "./index.scss";
import { translate } from "@Core/i18n";

@translate({})
class EmailNotificationTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateText: null,
    };
  }

  componentDidMount() {
    this.loadTemplate();
  }

  loadTemplate() {
    const engine = new Liquid({
      root: "./",
      extname: ".liquid",
    });

    const result = engine
      .renderFile(this.props.templateName, this.props.options)
      .then((text) => this.setState({ templateText: text }));
  }

  render() {
    return (
      <div
        className="ComponentEmailNotification"
        dangerouslySetInnerHTML={{
          __html: this.state.templateText,
        }}
      ></div>
    );
  }
}
export default EmailNotificationTemplate;
