import React from "react";
import { translate } from "@Core/i18n";
import YandexCheckout from "./yandex.checkout";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";

@translate({}, "PageCheckout")
export default class CheckoutStepPaymentYandex extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  loadWidget() {
    if (!this.props.yandexCheckoutToken) return;

    this.ref.current.innerHTML = "";

    const checkout = new YandexCheckout({
      confirmation_token: this.props.yandexCheckoutToken, // Token that must be obtained from Yandex.Checkout before the payment process
      return_url: this.props.returnURL, // URL to the payment completion page
      customization: {
        //modal: true,
        //Color scheme customization, minimum one parameter, color values in HEX
        colors: {
          //Accent color: Pay button, selected radio buttons, checkboxes, and text boxes
          controlPrimary: "#52aea2", //rosemary
          controlPrimaryContent: "#fff",
          background: "#fff", //Color value in HEX
        },
      },
      error_callback(error) {
        console.log("YandexCheckout error", error);
        // Processing of initialization errors
      },
    });
    console.log("try render checkout");

    checkout.render("YCheckout" + this.props.yandexCheckoutToken);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.loadWidget();
    }
  }

  componentDidMount() {
    this.loadWidget();
  }

  render() {
    return (
      <div
        ref={this.ref}
        id={"YCheckout" + this.props.yandexCheckoutToken}
        className="YandexCheckoutWidget"
      >
        <LoadingIndicator />
      </div>
    );
  }
}
