//@ts-nocheck
import React, { Component } from "react";
import "./index.scss";
import Icon from "./icon";

import PageLink from "@Components/Structure/PageLink";
import { translate } from "@Core/i18n";

@translate({}, "common")
export default class CartIcon extends Component {
  render() {
    if (this.props.count <= 0) return null;

    return (
      <span className={"componentCartIcon"}>
        <PageLink pageType="PAGE_CART">
          <span className={`${this.props.count > 0 && "active"}`}>
            <Icon className={this.props.count > 0 && "active"} />

            <span className="d-none d-sm-inline">{this.t("cart")}</span>
            {this.props.count > 0 && (
              <span className="count">
                &nbsp;<span className="d-none d-sm-inline">(</span>
                {this.props.count}
                <span className="d-none d-sm-inline">)</span>
              </span>
            )}
          </span>
        </PageLink>
      </span>
    );
  }
}
