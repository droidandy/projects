//@ts-nocheck
import React from "react";
import Price, { convertEURtoCurrentCurrency } from "../../../Price";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";
import { translate } from "@Core/i18n";
import redux from "@Core/redux";

import "./index.scss";

export interface Props {
  items?: Array<ICartItem>;
  isShippingRequired?: boolean;
  isDiscountLoading?: boolean;
  hiddenOnMobile: boolean;
  isDiscountFormHidden: boolean;

  discountCode?: string | null;
  discountInPresentmentCurrency?: number;
  itemsCost: number;

  lang?: string;

  onDiscountCodeUpdate?: (discountCode: string) => void;
}

@translate(
  {
    promo: "Код Скидки или Сертификата",
    confirm: "Применить",
    confirmCode: "Применить код",
    code: "Код скидки:",
    afterAddress: "определяется после ввода адреса",
    free: "Бесплатно",
    show: "Показать",
    hide: "Скрыть",
    order: " заказ",
  },
  "PageCheckout"
)
export default class CartSummary extends React.Component {
  constructor(props: Props) {
    super(props);

    this.state = {
      hiddenOnMobile: Boolean(props.hiddenOnMobile),
      isDiscountLoading: props.isDiscountLoading
        ? props.isDiscountLoading
        : false,
    };

    this.handleDiscountCodeUpdate = this.handleDiscountCodeUpdate.bind(this);
    this.toggleItemsListDisplay = this.toggleItemsListDisplay.bind(this);
  }

  handleDiscountCodeUpdate(event) {
    event.preventDefault();

    const discountInput = event.target.querySelector("input[type=text]");
    const discountCode = discountInput.value.trim();

    //clean up input entry
    discountInput.value = "";

    if (discountCode && this.props.discountCode !== discountCode) {
      this.props.onDiscountCodeUpdate(discountCode);
    }
  }

  toggleItemsListDisplay(event) {
    event.preventDefault();
    this.setState({ hiddenOnMobile: !this.state.hiddenOnMobile });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.hiddenOnMobile !== this.props.hiddenOnMobile &&
      this.props.hiddenOnMobile
    ) {
      this.setState({ hiddenOnMobile: true });
    }
  }

  renderItem(item: ICartItem, index) {
    if (item.quantity === 0) return;
    return (
      <div className="row cart-item" key={`line-item-${index}`}>
        <div className="col-3">
          <img src={item.product.imageURL} />
        </div>
        <div className="col my-auto">
          {item.product.title}
          <div className="price text-right">
            {item.quantity > 1 && `${item.quantity} x `}
            <Price price={item.price} />
          </div>
        </div>
      </div>
    );
  }

  renderDiscountForm() {
    if (
      this.state.hiddenOnMobile ||
      this.props.isDiscountFormHidden ||
      this.props.itemsCost == 0
    )
      return;

    if (this.props.isDiscountLoading) return <LoadingIndicator />;

    return (
      <form onSubmit={this.handleDiscountCodeUpdate}>
        <div className="row no-gutters discountCode">
          <div className="col">
            <input
              placeholder={this.i18n.promo}
              className="w-100 h-100"
              id="checkout_discount_code"
              autoComplete="off"
              aria-required="true"
              size="30"
              type="text"
              name="checkout[reduction_code]"
            />
          </div>

          <button
            name="button"
            type="submit"
            className="col-3 btn btn--secondary"
            aria-busy="false"
          >
            <span aria-hidden="true">{this.i18n.confirm}</span>
            <span hidden className="visually-hidden">
              {this.t("confirmCode")}
            </span>
          </button>
        </div>
      </form>
    );
  }

  renderDiscountValue() {
    if (!this.props.discountInPresentmentCurrency) return;

    return (
      <div className="row subtotal">
        <div className="col-4">{"Cкидка"}</div>
        <div className="col-8 text-right">
          - <Price price={this.getDiscountAmout()} />
          <br />
          {this.i18n.code} {this.props.discountCode}
        </div>
      </div>
    );
  }

  renderShipping() {
    if (this.props.isShippingRequired && !this.props.isShippingCostReady)
      return this.i18n.afterAddress;
    if (this.props.isShippingRequired && this.props.shippingCostInEUR > 0)
      return <Price priceInEUR={this.props.shippingCostInEUR} />;

    return this.i18n.free;
  }

  getDiscountAmout() {
    const reduxState = redux.getState();
    const currencyCode = reduxState.theme.currency.isoCode;

    const discountInPresentmentCurrency = this.props
      .discountInPresentmentCurrency;

    const discountAmout =
      currencyCode == "BYN"
        ? convertEURtoCurrentCurrency(discountInPresentmentCurrency / 100)
        : discountInPresentmentCurrency;

    return discountAmout;
  }

  getTotalPriceInCurrency() {
    const shipping = convertEURtoCurrentCurrency(
      this.props.shippingCostInEUR / 100
    );
    const discount = this.getDiscountAmout();
    const items = this.props.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return <Price price={shipping + items - discount} />;
    /* return JSON.stringify(
      {
        shipping,
        discount,
        items,
      },
      null,
      2
    ); */
  }

  renderTotal() {
    if (this.props.shippingCostInEUR == 0 && this.props.discountInEUR == 0)
      return null;

    return (
      <div className="row grand-total">
        <hr />

        <div className="col-4">{"Всего"}</div>
        <div className="col-8 text-right">{this.getTotalPriceInCurrency()}</div>
      </div>
    );
  }

  render() {
    return (
      <section id="cart-summary" className="CartSummary">
        <div className="toggle">
          <a href="#" onClick={this.toggleItemsListDisplay}>
            {this.state.hiddenOnMobile ? this.i18n.show : this.i18n.hide}{" "}
            {this.i18n.order}
          </a>
        </div>

        <div className={this.state.hiddenOnMobile ? "hiddenOnMobile" : ""}>
          {this.props.items.map(this.renderItem)}
        </div>
        {this.renderDiscountForm()}
        <div className="row subtotal">
          <div className="col-4">{"Стоимость"}</div>
          <div className="col-8 text-right">
            <Price prices={this.props.items} />
          </div>
        </div>
        {this.renderDiscountValue()}
        {this.props.isShippingRequired && (
          <div className="row shipping-total">
            <div className="col-4">{"Доставка"}</div>
            <div className="col-8 text-right">{this.renderShipping()}</div>
          </div>
        )}
        {this.renderTotal()}
      </section>
    );
  }
}
