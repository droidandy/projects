//@ts-nocheck
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { connect } from "@Components/index";
import isEqual from "lodash/isEqual";

import "./index.scss";
import {
  isShippingRequired,
  checkIsShippingCostReady,
  onBeforeStepChange,
  onAfterStepChange,
  onStateChange,
  defineSteps,
} from "./Configuration";
import { selectInStockItems } from "./sections/StepCartFilled/Items";
import deliveryCostCalculator from "@Core/checkout/deliveryCostCalculator";
import { translate } from "@Core/i18n";
import StepCartFilled from "./sections/StepCartFilled";
import StepCartEmpty from "./sections/StepCartEmpty";
import * as Validator from "@Core/utils/validators";

import StepShipping from "./sections/StepShipping";
import StepContactInformation from "./sections/StepContactInformation";
import StepPaymentYandex from "./sections/StepPaymentYandex";

import Error from "@Components/Structure/Error";
import CartSummary from "./sections/CartSummary";
import Buttons from "./sections/Buttons";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";
import Header from "@Components/Structure/Header";
import MessageUs from "@Components/SharedComponents/MessageUs";

const STEP_INIT = "STEP_INIT";
const STEP_CART_EMPTY = "STEP_CART_EMPTY";
const STEP_CART_FILLED = "STEP_CART_FILLED";
const STEP_CONTACT = "STEP_CONTACT";
const STEP_SHIPPING = "STEP_SHIPPING";
const STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT = "PAYMENT_SHOPIFY_DEFAULT";
const STEP_PAYMENT_WEBPAY_REDIRECT = "STEP_PAYMENT_WEBPAY_REDIRECT";
const STEP_PAYMENT_YANDEX_KASSA = "PAYMENT_YANDEX_KASSA";
const STEP_PAYMENT_FREE_REDIRECT = "STEP_PAYMENT_FREE_REDIRECT";

export const STEPS = {
  STEP_INIT,
  STEP_CART_EMPTY,
  STEP_CART_FILLED,
  STEP_CONTACT,
  STEP_SHIPPING,
  STEP_PAYMENT_WEBPAY_REDIRECT,
  STEP_PAYMENT_YANDEX_KASSA,
  STEP_PAYMENT_FREE_REDIRECT,
  STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT,
};

@translate(
  {
    "steps.title.cart": "Ваша Корзина",
    "steps.title.contactInfo": "Контактная информация",
    "steps.title.delivery": "Способ доставки",
    "steps.title.payment": "Способ оплаты",
    "steps.title.loading": "один момент...",
    "steps.button.payment": "Перейти к оплате",
    "steps.button.contactInfo": "Перейти к вводу контактной информации",
    "steps.button.deliver": "Перейти к доставке",
    "steps.button.back": "Вернуться",
    "steps.button.free": "Получить Бесплатно",
    "steps.button.confirm": "Оформить",
  },
  "PageCheckout"
)
class Checkout extends React.Component {
  headerRef = React.createRef();

  constructor(props) {
    super(props);

    this.refStepContact = React.createRef();

    const shippingAddress = this.props.shippingAddress
      ? this.props.shippingAddress
      : {
          address1: "",
          address2: "",
          city: "",
          company: "",
          firstName: "",
          lastName: "",
          phone: "",
          provinceCode: "",
          zip: "",
        };
    if (!shippingAddress.countryCode)
      shippingAddress.countryCode = this.props.defaultCountryCode
        ? this.props.defaultCountryCode
        : "RU";

    const email =
      this.props.customer && this.props.customer.email
        ? this.props.customer.email
        : this.props.email;

    let step = this.props.step ? this.props.step : null;
    if (step == null)
      step = !props.items || !props.items.length ? STEP_INIT : STEP_CART_FILLED;

    this.state = {
      defaultCountryCode: this.props.defaultCountryCode,
      regionCode: this.props.regionCode,
      discountInPresentmentCurrency: 0,

      isStepError: this.props.isStepError,
      isLoadingInProgress: false,
      isDiscountLoading: false,
      isShippingCostReady: false,

      storefrontCheckoutId: this.props.storefrontCheckoutId
        ? this.props.storefrontCheckoutId
        : null,
      checkoutId: this.props.checkoutId ? this.props.checkoutId : null,
      step,
      email,
      note: this.props.note ? this.props.note : "",
      customer: this.props.customer ? this.props.customer : {},

      items: this.props.items ? selectInStockItems(this.props.items) : [],
      allItems: this.props.items ? this.props.items : [],
      itemsCostInEUR: 0, //set on actionBeforeStepContactInfo
      itemsCost: this.props.items ? this.sumOfItemsCost(this.props.items) : 0,

      attributes: this.props.attributes ? this.props.attributes : {},
      shippingAddress,
      shippingCostInEUR: 0,
      shippingRateHandle: null,

      costs: {
        items: 0,
        shipping: 0,
        discount: 0,
      },
    };
  }

  sumOfItemsCost(items: ICartItem[]) {
    return items.reduce((acc, item) => acc + item.originalPrice / 100, 0);
  }

  componentDidMount() {
    if (this.state.items.length == 0) {
      this.setState({ step: STEP_CART_EMPTY });
    }
    this.getShippingCostAndHandle();
    if (this.state.step == STEP_CONTACT) {
      this.props
        .onBeforeStepChange(STEP_CONTACT, this.state)
        .then((fetchedData) => {
          this.setState(fetchedData);
        });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.items !== this.props.items && this.props.items.length > 0) {
      //  console.log("componentDidUpdate. items update because PROPS was changed", this.props.items);
      this.setState({
        items: selectInStockItems(this.props.items),
        allItems: this.props.items,
        step: STEP_CART_FILLED,
      });
    }

    if (prevProps.note !== this.props.note) {
      this.setState({
        note: this.props.note,
      });
    }

    if (prevProps.storefrontCheckoutId !== this.props.storefrontCheckoutId) {
      this.setState({ storefrontCheckoutId: this.props.storefrontCheckoutId });
    }

    if (prevProps.checkoutId !== this.props.checkoutId) {
      /* console.log(
        "componentDidUpdate. checkoutId update",
        this.props.checkoutId
      );
 */
      this.setState({ checkoutId: this.props.checkoutId });
    }

    if (this.state.step == STEP_CART_FILLED) {
      if (!isEqual(prevState.items, this.state.items)) {
        // console.log("componentDidUpdate. items update because STATE was changed", this.props.items);
        this.props.onStateChange("items", this.state.items);
        if (this.state.items.length == 0) {
          this.setState({ step: STEP_CART_EMPTY });
        }

        this.getShippingCostAndHandle();
      }

      if (prevState.note != this.state.note)
        this.props.onStateChange("note", this.state.note);
    }
    if (prevState.items != this.state.items) {
      this.setState({ itemsCost: this.sumOfItemsCost(this.state.items) });
    }

    if (prevState.shippingAddress != this.state.shippingAddress) {
      this.getShippingCostAndHandle();
    }

    if (this.state.step == STEP_CONTACT) {
      if (
        prevState.email != this.state.email &&
        Validator.isValidEmail(this.state.email)
      ) {
        this.props
          .onStateChange(
            "email",
            this.state.email,
            this.state.storefrontCheckoutId,
            this.state.checkoutId
          )
          .then((newStorefrontCheckoutId) => {
            /* console.log(
              "after onStateChange email. newStorefrontCheckoutId ",
              newStorefrontCheckoutId
            ); */

            this.setState({
              storefrontCheckoutId: newStorefrontCheckoutId,
            });
          });
      }

      if (prevState.shippingAddress != this.state.shippingAddress) {
        this.props.onStateChange(
          "address",
          this.state.shippingAddress,
          this.state.storefrontCheckoutId,
          this.state.checkoutId,
          isShippingRequired(this.state)
        );
      }

      if (prevState.discountCode != this.state.discountCode) {
        this.props
          .onStateChange(
            "discountCode",
            this.state.discountCode,
            this.state.storefrontCheckoutId
          )
          .then((discountInPresentmentCurrency) => {
            this.setState({
              discountInPresentmentCurrency,
              isDiscountLoading: false,
            });
          });
      }
    }
  }

  getShippingCostAndHandle() {
    const isShippingCostReady = checkIsShippingCostReady(this.state);
    if (!isShippingCostReady)
      return this.setState({
        isShippingCostReady: false,
        shippingCostInEUR: null,
        shippingRateHandle: null,
      });

    const shippingRate = deliveryCostCalculator(
      this.state.shippingAddress,
      this.state.itemsCostInEUR
    );

    if (shippingRate && shippingRate.handle) {
      this.setState({
        isShippingCostReady: true,
        shippingCostInEUR: shippingRate.price,
        shippingRateHandle: shippingRate.handle,
      });
    }
  }

  getStepHeader() {
    switch (this.state.step) {
      case STEP_CART_FILLED:
        return this.t("steps.title.cart");
      case STEP_CONTACT:
        return this.t("steps.title.contactInfo");
      case STEP_SHIPPING:
        return this.t("steps.title.delivery");
      case STEP_PAYMENT_YANDEX_KASSA:
        return this.t("steps.title.payment");

      case STEP_PAYMENT_FREE_REDIRECT:
      case STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT:
      case STEP_PAYMENT_WEBPAY_REDIRECT:
        return this.t("steps.title.loading");
    }
  }

  buttonNames() {
    const getNextStepText = (nextStepKey) => {
      switch (nextStepKey) {
        case STEP_CONTACT:
        case STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT:
          return this.t("steps.button.contactInfo");
        case STEP_SHIPPING:
          return this.t("steps.button.delivery");
        case STEP_PAYMENT_FREE_REDIRECT:
          return this.t("steps.button.free");
        case STEP_PAYMENT_YANDEX_KASSA:
          return this.t("steps.button.payment");
        case STEP_PAYMENT_WEBPAY_REDIRECT:
          return this.t("steps.button.confirm");
      }
    };

    const getBackStepText = (currentStep) => {
      switch (currentStep) {
        case STEP_PAYMENT_WEBPAY_REDIRECT:
        case STEP_PAYMENT_FREE_REDIRECT:
        case STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT:
          return null;
      }
      return this.t("steps.button.back");
    };

    const steps = defineSteps(this.state);
    const currentStepIndex = steps.findIndex((step) => step == this.state.step);
    const backStepIndex = currentStepIndex > 0 ? currentStepIndex - 1 : null;
    const nextStepIndex =
      currentStepIndex == steps.length - 1 ? null : currentStepIndex + 1;

    let nextStepKey = nextStepIndex !== null ? steps[nextStepIndex] : null;
    let nextStepText = getNextStepText(nextStepKey);

    let backStepText = getBackStepText(this.state.step);
    let backStepKey =
      backStepIndex !== null && backStepText !== null
        ? steps[backStepIndex]
        : null;

    return { backStepText, backStepKey, nextStepText, nextStepKey };
  }

  renderButtons() {
    const {
      backStepText,
      backStepKey,
      nextStepText,
      nextStepKey,
    } = this.buttonNames();

    if (!backStepText && !nextStepText) return null;

    const props = {
      isBackButtonHidden: backStepKey === null,
      isNextButtonHidden: nextStepKey === null,
      textBackButton: backStepText,
      textNextButton: nextStepText,
      nextStepKey,
      backStepKey,

      isLoading: this.state.isLoadingInProgress,
      onClick: this.handleStepChangeClick.bind(this),
    };

    return <Buttons {...props} />;
  }

  handleStepChangeClick(nextStep, isNext = false) {
    if (this.state.step == STEP_CONTACT && isNext) {
      if (!this.refStepContact.current.isValidToMoveForward()) return;
    }

    this.setState({ isLoadingInProgress: true, isStepError: false });

    this.props
      .onAfterStepChange(this.state.step, this.state, nextStep)
      .then((afterStepResult) => {
        this.setState({
          ...afterStepResult,
        });

        console.log(
          "onAfterStepChange result",
          this.state.step,
          afterStepResult
        );

        const combinedState = {
          ...this.state,
          ...afterStepResult,
        };
        return this.props.onBeforeStepChange(nextStep, combinedState);
      })
      .then((result) => {
        console.log("onBeforeStepChange result", nextStep, result);

        this.setState({
          ...result,
          isLoadingInProgress: false,
          step: nextStep,
        });

        // send focus to top
        this.headerRef.current.scrollIntoView();
      })
      .catch((e) => {
        console.log("steps error", JSON.stringify(e));

        this.setState({ isLoadingInProgress: false, isStepError: true });
        throw e;
      });
  }

  renderStepContent() {
    const state = this.state;

    switch (state.step) {
      case STEP_CART_EMPTY:
        return <StepCartEmpty lang={this.props.lang} />;

      case STEP_CART_FILLED:
        return (
          <StepCartFilled
            lang={this.props.lang}
            items={state.allItems}
            note={state.note}
            onItemsUpdate={(items) =>
              this.setState({
                allItems: items,
                items: selectInStockItems(items),
              })
            }
            onNoteUpdate={(note) => this.setState({ note })}
          />
        );
      case STEP_CONTACT:
        return (
          <StepContactInformation
            ref={this.refStepContact}
            onEmailUpdate={(email) => this.setState({ email })}
            onAddressUpdate={(shippingAddress) =>
              this.setState({ shippingAddress })
            }
            isShippingRequired={isShippingRequired(this.state)}
            shippingAddress={this.state.shippingAddress}
            email={this.state.email}
            customer={this.props.customer}
            acceptsMarketing={this.state.buyerAcceptsMarketing}
          />
        );
      case STEP_SHIPPING:
        return (
          <StepShipping
            shippingMethod={this.state.shippingMethod}
            subtotal={this.state.costs.items - this.state.costs.discount}
            address={this.state.shippingAddress}
            onUpdate={(shippingMethod) => this.setState({ shippingMethod })}
          />
        );
      case STEP_PAYMENT_YANDEX_KASSA:
        return (
          <StepPaymentYandex
            returnURL={this.state.yandexReturnURL}
            yandexCheckoutToken={this.state.yandexCheckoutToken}
          />
        );

      case STEP_INIT:
      case STEP_PAYMENT_WEBPAY_REDIRECT:
      case STEP_PAYMENT_FREE_REDIRECT:
      case STEP_PAYMENT_SHOPIFY_DEFAULT_REDIRECT:
        return <LoadingIndicator />;
    }
  }

  render() {
    const header = this.getStepHeader();

    return (
      <div>
        {header && <Header text={header} />}
        {/* {JSON.stringify(this.state.checkoutId)}
        {JSON.stringify({
          isShippingCostReady: this.state.isShippingCostReady,
          shippingCostInEUR: this.state.shippingCostInEUR,
          shippingRateHandle: this.state.shippingRateHandle,
          itemsCostInEUR: this.state.itemsCostInEUR,
        })} */}
        <div ref={this.headerRef} className="checkoutComponent2 row">
          <div
            key="stepContent"
            className="content col-md col-sm-12 order-md-1 order-2 order-md-1"
          >
            <div
              key="content"
              className={
                this.state.isLoadingInProgress ? "isLoading content" : "content"
              }
            >
              {/* JSON.stringify(this.props.customer) */}
              {this.renderStepContent()}
            </div>
            <div key="buttons" className="buttons">
              {this.state.isStepError ? (
                <Error text="произошла ошибка, попробуйте повторить" />
              ) : (
                ""
              )}
              {this.renderButtons()}
            </div>
          </div>
          {[STEP_CONTACT, STEP_SHIPPING, STEP_PAYMENT_YANDEX_KASSA].includes(
            this.state.step
          ) && (
            <div
              key="cartSummary"
              className="cartSummary col-md-5 col-sm-12 order-1 order-md-2 sidebar mb-5"
            >
              <CartSummary
                hiddenOnMobile={this.state.step == STEP_PAYMENT_YANDEX_KASSA}
                items={this.state.items}
                itemsCost={this.state.itemsCost}
                isShippingRequired={isShippingRequired(this.state)}
                isShippingCostReady={this.state.isShippingCostReady}
                shippingCostInEUR={this.state.shippingCostInEUR}
                discountCode={this.state.discountCode}
                discountInPresentmentCurrency={
                  this.state.discountInPresentmentCurrency
                }
                isDiscountFormHidden={
                  this.state.step == STEP_CONTACT ? false : true
                }
                isDiscountLoading={this.state.isDiscountLoading}
                onDiscountCodeUpdate={(discountCode) =>
                  this.setState({ isDiscountLoading: true, discountCode })
                }
              />
            </div>
          )}
        </div>
        <MessageUs lang={this.props.lang} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const stepFromRoute =
    state.app.route.params.step == "contact_information"
      ? "STEP_CONTACT"
      : null;

  return {
    step: ownProps.step ? ownProps.step : stepFromRoute,
    items: ownProps.items ? ownProps.items : state.checkout.items,
    note: ownProps.note ? ownProps.note : state.checkout.note,
    storefrontCheckoutId: ownProps.storefrontCheckoutId
      ? ownProps.storefrontCheckoutId
      : state.checkout.storefrontCheckoutId,
    checkoutId: ownProps.checkoutId
      ? ownProps.checkoutId
      : state.checkout.checkoutId,

    defaultCountryCode: ownProps.defaultCountryCode
      ? ownProps.defaultCountryCode
      : state.customer.defaultCountryCode,

    regionCode: ownProps.regionCode
      ? ownProps.regionCode
      : state.app.localizationSettings.regionCode,

    //customer: ownProps.customer ? ownProps.customer : state.customer,

    attributes: ownProps.attributes
      ? ownProps.attributes
      : {
          skinType: state.quiz.skinType,
          skinCareGoals: state.quiz.skinCareGoals,
          videoGoals: state.quiz.videoGoals,
        },
    onBeforeStepChange: ownProps.onBeforeStepChange
      ? ownProps.onBeforeStepChange
      : onBeforeStepChange,
    onAfterStepChange: ownProps.onAfterStepChange
      ? ownProps.onAfterStepChange
      : onAfterStepChange,
    onStateChange: ownProps.onStateChange
      ? ownProps.onStateChange
      : onStateChange,
  };
};

export default connect(mapStateToProps, null)(Checkout);
