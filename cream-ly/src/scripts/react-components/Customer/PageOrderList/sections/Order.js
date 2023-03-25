import React, { Component } from "react";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import Address from "@Components/Structure/Address";
import QuizOption from "../../../PageQuiz/sections/option";
import Product from "./Product";
import VideoProduct from "./VideoProduct";

@translate(
  {
    orderN: "Заказ ",
    address: "Адрес доставки:",
    goals: "Цели ухода:",
    tracking: "Трекинг-номер:",
    note: "Комментарий",
    status: {
      canceled: "Отменен",
      accepted: "Принят",
      sent: "Отправлен"
    }
  },
  "PageOrderList"
)
class Order extends Component {
  handleClickMore = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
  };
  getProduct = ({sku, ...orderItem}) => {
    if (!sku) return {};

    if (
      orderItem.product &&
      orderItem.product.tags &&
      orderItem.product.tags.includes("videoProduct")
    ) {
      return this.props.videos.find(video => sku === video.sku);
    }
    return this.props.products.find(item => {
      return Object.keys(item.variants).includes(sku);
    });
  };
  getStatus = () => {
    const fulfillmentStauts = this.props.order.fulfillment_status;
    const financialStatus = this.props.order.financial_status;

    let status;
    if (fulfillmentStauts === "fulfilled") {
      status = "sent";
    } else if (financialStatus === "refunded" || financialStatus === "voided") {
      status = "canceled";
    } else {
      status = "accepted";
    }

    return status;
  };
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed:
        this.props.isCollapsed !== undefined ? this.props.isCollapsed : true
    };

    this.imageSizes = {};
  }

  render() {
    const note_attributes =
      this.props.order &&
      this.props.order.note_attributes &&
      Array.isArray(this.props.order.note_attributes)
        ? this.props.order.note_attributes.reduce((acc, el) => {
            return {
              ...acc,
              [el.name]: el.value
            };
          }, {})
        : this.props.order.note_attributes || {};

    let skinCareGoals = {};
    skinCareGoals =
      typeof note_attributes.skinCareGoals === "string"
        ? note_attributes.skinCareGoals
            .replace(/&amp;quot;/g, "")
            .replace(/&quot;/g, "")
            .replace("[", "")
            .replace("]", "")
            .split(",")
        : [];
    const goals = note_attributes.skinType
      ? [note_attributes.skinType, ...skinCareGoals]
      : skinCareGoals;

    // console.log("skincaregoals", skinCareGoals);

    /* if (note_attributes.skinCareGoals)
      goals = [...goals, JSON.parse(note_attributes.skinCareGoals)];
 */
    const products =
      this.props.order &&
      this.props.order.items &&
      Array.isArray(this.props.order.items)
        ? this.props.order.items.map(item => {
            return {
              ...item,
              ...this.getProduct(item)
            };
          })
        : [];

    const date = new Date(this.props.order.created_at).toLocaleDateString(
      this.props.lang,
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

    const isAddressVisible =
      this.props.order.shipping_address &&
      this.props.order.shipping_address.address1 !=
        this.props.order.shipping_address.city;

    return (
      <div
        className={`OrderItem ${this.state.isCollapsed ? "collapsed" : "open"}`}
        key={this.props.key}
      >
        <div className="row top" onClick={this.handleClickMore}>
          <div className="row top--mobile">
            <div className="cell">
              <b>
                {this.t("orderN")}
                {this.props.order.name}
              </b>
            </div>
            <div className="cell">{date}</div>
            <div className="cell cell--last">
              <span data-test="order-status">
                {this.t(`status.${this.getStatus()}`)}
              </span>
              <i
                className={`fas fa-chevron-${
                  this.state.isCollapsed ? "down" : "up"
                }`}
              />
            </div>
          </div>
        </div>

        <div hidden={this.state.isCollapsed}>
          <div className="row" data-test="order-collabsed-block">
            <div hidden={!isAddressVisible} className="cell">
              {this.t("address")}
            </div>
            <div hidden={!isAddressVisible} className="cell">
              {isAddressVisible && (
                <Address address={this.props.order.shipping_address} />
              )}
            </div>
            {/* <div className="cell change">
                <i class="fas fa-pencil-alt"></i>
                {this.t("change")}
              </div> */}
          </div>
          {this.props.order.fulfillment_status === "fulfilled" &&
            this.props.order.fulfillments &&
            this.props.order.fulfillments.length && (
              <div className="row">
                <div className="cell">{this.t("tracking")}</div>
                <div className="cell">
                  {this.props.order.fulfillments.map(
                    (fulfillment, fulfillmentIndex) => {
                      return fulfillment.tracking_numbers.map(
                        (track, trackIndex) => (
                          <div
                            className="line"
                            key={`key-${fulfillmentIndex}.${trackIndex}`}
                          >
                            <a href={track} target="_blank">
                              {track}
                            </a>
                          </div>
                        )
                      );
                    }
                  )}
                </div>
              </div>
            )}
          {Boolean(goals.length) && (
            <div className="row" key="goals">
              <div className="cell">{this.t("goals")}</div>
              <div className="cell quiz">
                {goals.map((value, i) => (
                  <QuizOption key={i} value={value} />
                ))}
              </div>
            </div>
          )}

          {this.props.order.note && this.props.order.note.length && (
            <div className="row" key="note">
              <div className="cell">{this.t("note")}</div>
              <div className="cell" data-test="order-note">
                {this.props.order.note}
              </div>
            </div>
          )}
          <div className="row test" key="products">
            {products.map(product => {
              if (product.demoVimeo) {
                return (
                  <VideoProduct
                    {...product}
                    lang={this.props.lang}
                    key={product.handle}
                  />
                );
              } else {
                return (
                  <Product
                    product={product}
                    {...product}
                    lang={this.props.lang}
                    imageSize={{
                      width: 216,
                      height: 266
                    }}
                    key={product.handle}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}

Order.defaultProps = {
  products: []
};

const mapStateToProps = state => {
  return {
    products: state.products.list,
    videos: state.products.videos
  };
};
export default connect(mapStateToProps, null)(Order);
