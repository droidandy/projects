import React from "react";
import { translate } from "@Core/i18n";

@translate(
  {
    webpay_cart: "Оплата банковской картой",
    payment: "Способ Оплаты",
    paymentCrypt: "Ваши данные оплаты будут надежно зашифрованы",
  },
  "PageCheckout"
)
export default class StepPaymentWebpay extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    if (typeof this.props.onUpdate !== "function")
      throw Error("prop onUpdate requires function");

    this.state = {
      selected: props.selected ? props.selected : "webpay_cart",
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);

    // this.actionsData = this.actionsData.bind(this);
  }

  handleOptionChange() {
    const value = this.ref.current.querySelector("input[type=radio]:checked")
      .value;
    this.setState({
      selectedOption: value,
    });
    this.props.onUpdate(value);
  }

  componentDidMount() {
    // propagate default option to parent
    this.handleOptionChange();
  }

  listOfPaymentOptions() {
    const options = [];
    options.push({ title: this.i18n.webpay_cart, handle: "webpay_cart" });

    //  if (this.props.showERIP) options.push({title:"Оплата ЕРИП", handle:"webpay_erip"})

    return options;
  }
  render() {
    const defaultOption = this.state.selected;

    const optionsHTML = [];
    const options = this.listOfPaymentOptions();

    for (const i in options) {
      const option = options[i];

      optionsHTML.push(
        <div key={i} className="content-box__row">
          <div className="row radio-wrapper">
            <div className="col-1 radio__input">
              <input
                className="input-radio"
                aria-label={option.title}
                type="radio"
                value={option.handle}
                defaultChecked={defaultOption == option.handle}
                onChange={this.handleOptionChange}
                name="checkout[payment_method]"
                id={"checkout_payment_option_" + option.handle}
              />
            </div>
            <label
              className="radio__label "
              aria-hidden="true"
              htmlFor={"checkout_payment_option_" + option.handle}
            >
              <span className="col radio__label__primary">{option.title}</span>
            </label>
          </div>
        </div>
      );
    }

    return (
      <section>
        <div className="section section--shipping-method">
          <div key="header" className="section__header">
            <h2 className="section__title" id="main-header" tabIndex="-1">
              {this.i18n.payment}
            </h2>
            <p hidden className="section__text">
              {this.i18n.paymentCrypt}
            </p>
          </div>

          <div ref={this.ref} key="options" className="paymentMethods">
            {optionsHTML}
          </div>
        </div>
      </section>
    );
  }
}
