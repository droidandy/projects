//@ts-nocheck
import React, { Component } from "react";
import PageLink from "@Components/Structure/PageLink";
import UserIcon from "./UserIcon";

import "./index.scss";

export default class AccountIcon extends Component {
  render() {
    let className = "ComponentAccountIcon";
    className += this.props.isCustomerLoggedIn ? " loggedIn" : "";

    return (
      <span className={className}>
        <PageLink pageType="PAGE_CUSTOMER_ACCOUNT">
          <UserIcon />
        </PageLink>
      </span>
    );
  }
}
