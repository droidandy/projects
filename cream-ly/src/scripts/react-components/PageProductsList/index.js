import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "@Components/index";
import StateShape from "@Core/redux/shape.ts";
import { isProductRecommended } from "@Core/quiz";

import "./index.scss";
import Products from "./sections/Products";
import VideoList from "../VideoList";
import Header from "@Components/Structure/Header";
import PageLink from "@Components/Structure/PageLink";
import MessageUs from "@Components/SharedComponents/MessageUs";
import PromoAdvantages from "@Components/SharedComponents/PromoAdvantages";
import InstagramWidget from "@Components/SharedComponents/InstagramFeedback";
import { translate } from "@Core/i18n";

const convertHandles2Products = (handles, products, t, lang) => {
  const video = {
    title: t("products.videos"),
    handle: "videos",
    url: "/pages/videos",
    isHiddenInLang: { en: true },
    image: {
      small:
        "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_200x.png?v=1575882633",
      big:
        "https://cdn.shopify.com/s/files/1/2367/5871/products/Massage_1000x.png?v=1575882633",
    },
  };

  return handles.map((handle) => {
    const product =
      handle === "videos"
        ? video
        : products.filter((product) => product.handle == handle).shift();

    return {
      ...product,
      recommendedVariant:
        product.recommendedVariant ||
        isProductRecommended(product.handle, true),
    };
  });
};

const collections = {
  face: [
    "flower-powder-my-skin",
    "cream-my-skin",
    "nourish-my-skin",
    "exfoliate-my-skin",
    // "videos",
  ],
  body: ["cream-my-body", "brush-my-body", "clean-my-skin"],
  home: ["robe", "headband", "candle"],
  other: [
    "gift-card",
    "individual-skincare-consultation",
    "individual-face-massage",
    "individual-consultation-with-alena",
  ],
};

/**
 *  @param {StateShape} state - redux state
 */
const mapStoreToProps = (state, ownProps) => {
  return {
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,
    products: ownProps.products ? ownProps.products : state.products.list,
  };
};

@translate(
  {
    header: "НАШИ ПРОДУКТЫ",
    intro: {
      text:
        "А вот и наши продукты, которые будут кастомизированы в зависимости от ваших ответов на",
      link: " вопросы квиза",
    },
    products: {
      videos: "Видео-курсы",
    },
    collection: {
      face: "УХОД ЗА ЛИЦОМ",
      body: "УХОД ЗА ТЕЛОМ",
      other: "КОНСУЛЬТАЦИИ И ПОДАРОЧНЫЕ СЕРТИФИКАТЫ",
      videos: "МАСТЕР-КЛАССЫ И ВИДЕО КУРСЫ",
    },
  },
  "PageProductsList"
)
class PageProductsList extends React.Component {
  constructor(props) {
    super(props);

    this.collection = {
      face: convertHandles2Products(
        collections.face,
        this.props.products,
        this.t,
        this.props.lang
      ),
      body: convertHandles2Products(
        collections.body,
        this.props.products,
        this.t,
        this.props.lang
      ),
      home: convertHandles2Products(
        collections.home,
        this.props.products,
        this.t,
        this.props.lang,
        
      ),
      other: convertHandles2Products(
        collections.other,
        this.props.products,
        this.t,
        this.props.lang
      ),
    };

   
    //hide headband for NL
    if (this.props.fulfillmentCode == "NL") {
      this.collection.home = this.collection.home.filter((product)=>product.handle != "headband")
    }
   

  }

  render() {
    return (
      <div className="PageProductsList">
        <Header isPageHeader text={this.t("header")} />
        <div className="intro">
          {this.t("intro.text")}
          <PageLink pageType="PAGE_QUIZ_OR_RESULTS">
            {this.t("intro.link")}
          </PageLink>
        </div>
        <Products
          title={this.t("collection.face")}
          list="face"
          products={this.collection.face}
          imageSize={{
            width: 216,
            height: 266
          }}
          lang={this.props.lang}
        />
        <Products
          title={this.t("collection.body")}
          list="body"
          products={this.collection.body}
          imageSize={{
            width: 216,
            height: 266
          }}
          lang={this.props.lang}
        />
        <Products
          list="home"
          title={this.t("collection.home")}
          products={this.collection.home}
          imageSize={{
            width: 293,
            height: 360,
          }}
          lang={this.props.lang}
        />

        <Products
          list="other"
          title={this.t("collection.other")}
          products={this.collection.other}
          imageSize={{
            width: 293,
            height: isMobile ? 84 : 120,
          }}
          lang={this.props.lang}
        />
        {this.props.lang === "ru" && (
          <>
            <Header text={this.t("collection.videos")} sub />
            <VideoList
              videos={this.props.videos}
              isVisiblePurchasedBadge={true}
              columnSize="col-6 col-sm-4 col-md-3"
            />
          </>
        )}
        <PromoAdvantages lang={this.props.lang} />
        <MessageUs lang={this.props.lang} />
        <InstagramWidget lang={this.props.lang} />
      </div>
    );
  }
}

export default connect(mapStoreToProps)(PageProductsList);
