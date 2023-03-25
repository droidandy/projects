import React from "react";
import Price from "../../../Price";
import {
  convertEURtoShopifyCurrency,
  convertShopifyCurrencyToEUR,
} from "@Core/currency";
import { translate } from "@Core/i18n";
import * as deliveryCalculator from "@Core/checkout/deliveryCostCalculator";

@translate(
  {
    shipping: "Способ доставки",
  },
  "PageCheckout"
)
export default class CheckoutStepShipping extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    if (typeof this.props.onUpdate !== "function")
      throw Error("prop onUpdate requires function");

    this.state = {
      isUpdateInProgress: false,
      options: this.selectShippingOptions(
        this.props.subtotal,
        this.props.address
      ),
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    if (!this.state.options.length) return;

    // this.setState({ isUpdateInProgress: true });

    this.props.onUpdate({
      handle: this.state.options[0].name,
      title: this.state.options[0].name,
      price: convertEURtoShopifyCurrency(this.state.options[0].price),
    });

    //this.setState({ isUpdateInProgress: false });
  }

  componentDidMount() {
    // propagate default option to parent
    this.handleChange();
  }

  render() {
    const optionsHTML = [];
    // const currentShippingMethod = this.props.parentState.shippingMethod.title;

    if (this.state.options && this.state.options.length)
      this.state.options.forEach((option, index) => {
        // defaultChecked={currentShippingMethod === option.name}
        optionsHTML.push(
          <div key={index} className="row radio-wrapper">
            <div key="input" className="col-1 radio__input">
              <input
                className="input-radio"
                aria-label="{option.name}"
                type="radio"
                defaultChecked={true}
                value="shopify-{option.name}-{option.price}"
                name="checkout[shipping_rate][id]"
                id="checkout_shipping_rate_id_shopify-{option.name}-{option.price}"
              />
            </div>
            <label
              key="label"
              className="col radio__label "
              aria-hidden="true"
              htmlFor="checkout_shipping_rate_id_shopify-{option.name}-{option.price}"
            >
              <div className="row">
                <span key="name" className="col radio__label__primary">
                  {option.name}
                </span>
                <span
                  key="price"
                  className="col-3 text-right content-box__emphasis"
                >
                  <Price priceInEUR={option.price} />
                </span>
              </div>
            </label>
          </div>
        );
      });

    /*
        let province = '';
        if (this.props.parentState.shippingAddress.province)
            province = ", "+this.props.parentState.shippingAddress.province;
*/

    return (
      <section>
        <div key="shipping" className="section section--shipping-method">
          <div key="header" className="section__header">
            <h2 className="section__title" id="main-header" tabIndex="-1">
              {this.i18n.shipping}
            </h2>
          </div>

          {this.state.isUpdateInProgress}

          <div
            key="methods"
            ref={this.ref}
            className="shippingMethods"
            onChange={(event) =>
              this.props.onChange("shippingMethod", event.target.value)
            }
          >
            {optionsHTML}
          </div>
        </div>
      </section>
    );
  }

  selectShippingOptions(priceSubtotalMinusDiscountInCents, shippingAddress) {
    const amountInEUR = convertShopifyCurrencyToEUR(
      priceSubtotalMinusDiscountInCents
    );

    const shippingZone = deliveryCalculator.getShippingZoneBasedOnAddress(
      shippingAddress
    );

    const options = deliveryCalculator.getRatesForShippingZone(
      shippingZone,
      amountInEUR
    );

    return options;
  }
}
