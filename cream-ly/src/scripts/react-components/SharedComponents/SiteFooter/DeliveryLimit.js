import React, { Component } from "react";
import Price from "../../Price";

export default class DeliveryLimit extends Component {
  render() {
    return (
      <div>
        {this.props.layout.name === "number" ? (
          <Price
            price={this.props.countryCode === "RU" ? 8000 : 9500}
            layout="number"
          />
        ) : (
          <div>
            <img
              src={require("./icon_delivery.svg")}
              style={{
                marginRight: "10px",
                height: "20px",
              }}
            />
            {this.props.host === "creamly.by" && (
              <>
                <span>Free Shipping to</span> <span>Belarus</span>
              </>
            )}
            {this.props.countryName && this.props.countryCode !== "unknown" ? (
              <>
                <span>Free Shipping to</span>{" "}
                <span>{this.props.countryName}</span>
              </>
            ) : (
              <span>Free Worldwide Shipping</span>
            )}
            <br className="d-block d-sm-none" />
            <span>on orders over</span>
            <Price priceEUR={this.props.host === "creamly.by" ? 5000 : 12000} />
          </div>
        )}
      </div>
    );
  }
}
