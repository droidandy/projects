import React from "react";
import size from "lodash/size";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import ProductHeader from "./sections/ProductHeader";
import { getVimeoId } from "@Core/products/demoVideo";

import "./index.scss";
import Gallery from "./sections/Gallery";
import ProductQuiz from "@Components/PageProductDetails/sections/ProductQuiz";
import CreamBodyQuiz from "@Components/PageProductDetails/sections/CreamBodyQuiz";
import RobeQuiz from "@Components/PageProductDetails/sections/RobeQuiz";
import CandleQuiz from "@Components/PageProductDetails/sections/CandleQuiz";

import ProductDescription from "./sections/ProductDescription";
import EmailForm from "@Components/EmailSubscription/ProductSubscribe";
import VimeoVideo from "@Components/SharedComponents/VimeoVideo";
import Header from "@Components/Structure/Header";
import MessageUs from "@Components/SharedComponents/MessageUs";
import Advantages from "@Components/SharedComponents/PromoAdvantages";
import Instagram from "@Components/SharedComponents/InstagramFeedback";
import Price from "../Price";
import PageLink from "@Components/Structure/PageLink";
import ProductFeedback from "@Components/SharedComponents/ProductFeedbacks";
import Select from "./sections/Select";

import actionClickOnBuyButton from "./actions/actionClickOnBuyButton";
import Button from "@Components/Structure/Button";
import { GALLERY_HANDLES } from "@Core/products/images";
@translate(
  {
    back: "Назад к списку наших продуктов",
    titleIngredients: "СОСТАВ",
    titleUsage: "ПРИМЕНЕНИЕ",
    titleVideo: "ВИДЕО ОБЗОР",
    noSelectText: "Выберите какой продукт вам больше подходит",
    selectBtn: "Выбрать",
    buttonAdd: "Добавить в корзину",
    buttonQuiz: "Пройти опрос",
    noSelectText: "Выберите какой продукт вам больше подходит",
    selectBtn: "Выбрать",
    your: "Ваш",

    skinTypes: {
      normal: "Нормальная",
      dry: "Сухая",
      oily: "Жирная",
      mixed: "Смешанная",
      wrinkles: "Уменьшить морщинки",
      acne: "Уменьшить акне",
      sensitive: "Уход за чувствительной кожей",
      dehydrated: "Уход за обезвоженной кожей",
      pimple: "Уменьшить небольшое акне (например, перед менструацией)",
      lighten: "Осветлить следы от пигментации или акне",
      body: "Увлажнение кожи тела",
      edema: "Уменьшить отечность",
      capillaries: "Уменьшить купероз",
      neck_wrinkles: "Убрать кольца венеры",
      breast_shape: "Улучшить форму груди",
      cellulite: "Уменьшить целлюлит",
    },
  },
  "PageProductDetails"
)
class PageProductDetails extends React.Component {
  state = {
    variant: this.props.variant ? this.props.variant : {},
  };

  handleChangeVariantBySKU = (sku) => {
    const variant = getVariantFromProductBySKU(this.props.product, sku);
    this.setState({
      variant,
    });
  };

  filterGalleryImages = () => {
    const { variant } = this.state;
    const { images, handle } = this.props.product;

    if (size(variant)) {
      if (["robe", "headband"].includes(handle)) {
        const color = variant.sku.split("-").slice(-1);
        const imgCodes = GALLERY_HANDLES[handle][color];
        const filteredImages = images
          .filter(({ big }) => imgCodes.some((val) => big.includes(val)))
          .sort(
            (a, b) =>
              imgCodes.findIndex(val => a.big.includes(val)) -
              imgCodes.findIndex(val => b.big.includes(val))
          );
        return filteredImages;
      }
      if (["cream-my-body"].includes(handle)) {
        const isCreamMyBodyAtopic = variant.sku === "SKU-cream-my-body-atopic";
        return images.filter((image, index) => index !== (isCreamMyBodyAtopic ? 0 : 1));
      }
      if (handle === "candle") {
        const [color] = variant.sku.split("-").slice(-1);
        return images
          .filter(({ big }) => big.includes(color))
          .sort((a, b) => a.big - b.big);
      }
    }
    return images;
  };

  render() {
    const { handle, incorrectHandle } = this.props;

    const sku = this.state.variant.sku;
    const skuForKey =
      sku === "SKU-cream-peptides"
        ? "cream-my-skin-with-peptides"
        : this.props.handle;

    const gallery = {
      images: this.filterGalleryImages(),
      altText: this.t(`products.${handle}.title`),
      handle,
    };
    const videoReviewId = getVimeoId(
      this.props.product.handle,
      sku,
      this.props.lang
    );
    if (videoReviewId) gallery.videos = [{ vimeoId: videoReviewId }];

    const { variants } = this.props.product;
    const isQuizAvailable = this.props.handle.includes("cream-my-skin");
    this.props.handle.includes("nourish-my-skin");

    const keyForIngedients = isQuizAvailable
      ? `products:${this.props.handle}.commonIngredients`
      : `products:${skuForKey}.${sku}.ingredients`;

    const description = this.t(`products:${handle}.description`, {
      ingredients: this.t(keyForIngedients),
      shortDescription: this.t(`products:${incorrectHandle}.${sku}.shortDescription`),
    });

    // const { skinType, skinCareGoals } = this.props.quiz;

    // const variant = SKU
    //   ? Object.keys(variants).find(key => key === SKU)
    //   : variants
    //   ? Object.values(variants)[0]
    //   : {};
    let variant;

    if (this.props.sku) {
      variant =
        variants[Object.keys(variants).find((key) => key === this.props.sku)];
    } else {
      variant = variants ? Object.values(variants)[0] : {};
    }

    // we can show price per variant for some products
    const isPricePerVariant = ["cream-my-body", "nourish-my-skin"].includes(this.props.handle);

    const price =
      (this.props.product.priceRange.min != this.props.product.priceRange.max) &&
      !isPricePerVariant ? (
        <>
          <Price price={this.props.product.priceRange.min} /> -{" "}
          <Price price={this.props.product.priceRange.max} />
        </>
      ) : (
        <Price price={isPricePerVariant ? this.state.variant.price : this.props.product.price} />
      );

    const stringFeedback = this.t(`products:${handle}.feedbacks`);

    const feedbacks = stringFeedback.includes("[")
      ? stringFeedback
          .replace("[", "")
          .replace("]", "")
          .split('",')
          .map((item) => item.replace('"', "").trim())
          .filter((item) => !!item.length)
      : [];

    const hasSKU = Boolean(this.props.sku);

    return (
      <div className="PageProductDetails">
        <div className="row spacingBottomMedium">
          <div className="back_pro_link col-lg-4 d-lg-block section-header">
            <PageLink pageType="PAGE_PRODUCTS">{this.t("back")}</PageLink>
          </div>
          <ProductHeader
            text={this.t(`products:${handle}.title`)}
            isOutOfStock={this.state.variant.isOutOfStock}
            isRecommended={this.props.product.isRecommended}
            handle={handle}
            price={price}
            size={this.state.variant.sizeInMl || this.props.product.sizeInMl}
            lang={this.props.lang}
          />
        </div>
        <div className="row spacingBottom">
          <div className="col-lg-6 PageProductDetails__col">
            <Gallery {...gallery} />
          </div>

          <div className="col-lg-6 PageProductDetails__col">
            {this.renderAddToCart(isQuizAvailable)}
          </div>
        </div>
        <ProductDescription description={description} />

        {Array.isArray(feedbacks) && feedbacks.length > 0 && (
          <ProductFeedback
            lang={this.props.lang}
            title={this.t(`products:${handle}.title`)}
            feedbacks={feedbacks}
          />
        )}
        {videoReviewId && (
          <div className="video spacingBottom">
            <Header
              text={`${this.t("titleVideo")} ${this.t(
                `products:${handle}.title`
              )}`}
            />
            <VimeoVideo vimeoId={videoReviewId} />
          </div>
        )}
        <MessageUs lang={this.props.lang} />
        <div className="advantages spacingBottom">
          <Advantages lang={this.props.lang} />
        </div>
        {this.props.lang === "ru" && <Instagram />}
      </div>
    );
  }

  renderAddToCart() {
    if (this.props.product.isOutOfStock)
      return (
        <div className="mt-5">
          <EmailForm
            signUpLocation={
              "outOfStock-" +
              this.props.region +
              "-" +
              this.props.product.handle
            }
            promoText={this.t("EmailSubscribe:waitingList.text", {
              product: this.props.product.title,
            })}
            productTitle={this.props.product.title}
            lang={this.props.lang}
          />
        </div>
      );

    if (this.props.handle === "robe" || this.props.handle === "headband")
      return (
        <RobeQuiz
          lang={this.props.lang}
          handle={this.props.handle}
          variants={this.props.product.variants}
          selectedSKU={this.state.variant.sku}
          onComplete={this.props.actionClickOnBuyButton}
          onChangeVariant={this.handleChangeVariantBySKU}
          variantIsOutOfStock={this.state.variant.isOutOfStock}
        />
      );

    if (this.props.handle === "candle") {
      return (
        <CandleQuiz
          lang={this.props.lang}
          variants={this.props.product.variants}
          selectedSKU={this.state.variant.sku}
          onComplete={this.props.actionClickOnBuyButton}
          onChangeVariant={this.handleChangeVariantBySKU}
          variantIsOutOfStock={this.state.variant.isOutOfStock}
        />
      );
    }

    if (this.props.handle === "gift-card") {
      return (
        <React.Fragment>
          <Select
            label={this.t("PageProductDetails:giftCardAmount")}
            variants={this.props.product.variants}
            selectedSKU={this.state.variant.sku}
            onChange={(e) => {
              this.handleChangeVariantBySKU(e.target.value);
            }}
          />
          <Button
            green
            onClick={() => {
              this.props.actionClickOnBuyButton(this.state.variant.id);
            }}
          >
            {this.t("PageQuizResult:summary.buttonAddToCart")}
          </Button>
        </React.Fragment>
      );
    }

    if (this.props.handle === "cream-my-body") {
      return (
        <CreamBodyQuiz
          lang={this.props.lang}
          onComplete={this.props.actionClickOnBuyButton}
          onChange={this.handleChangeVariantBySKU}
          variantIsOutOfStock={this.state.variant.isOutOfStock}
        />
      );
    }

    if (
      this.props.handle === "nourish-my-skin" ||
      this.props.handle.includes("cream-my-skin")
    ) {
      return (
        <ProductQuiz
          handle={this.props.handle}
          lang={this.props.lang}
          variantIsOutOfStock={this.state.variant.isOutOfStock}
          onComplete={this.props.actionClickOnBuyButton}
          onChange={this.handleChangeVariantBySKU}
        />
      );
    }

    return (
      <Button
        className="mt-3"
        green
        onClick={() => {
          const goals = [];
          if (this.props.handle === "clean-my-skin") {
            goals.concat("cleansing"); // TODO make helper get goals for sku
          }
          this.props.actionClickOnBuyButton(this.state.variant.id, null, goals);
        }}
        disabled={this.state.variant.isOutOfStock}
      >
        {this.t("PageQuizResult:summary.buttonAddToCart")}
      </Button>
    );
  }
}

PageProductDetails.defaultProps = {
  actionClickOnBuyButton,
};

const mapStateToProps = (state, ownProps) => {
  const handle = handleCorrect(ownProps.handle);
  const prodcutFromState = getProductFromStateByHandle(state, handle);
  const productVariant = getVariantFromProductBySKU(
    prodcutFromState,
    ownProps.sku
  );

  return {
    handle,
    incorrectHandle: ownProps.handle,
    product: ownProps.product
      ? { ...prodcutFromState, ...ownProps.product }
      : prodcutFromState,
    variant: productVariant,
    region: state.app.localizationSettings.fulfillmentCode,
  };
};

const getVariantFromProductBySKU = (product, sku) => {
  if (product.variants[sku]) return product.variants[sku];

  const SKUlist = Object.keys(product.variants);
  return product.variants[SKUlist[0]];
};

const handleCorrect = (handle) => {
  if (handle === "cream-my-skin-with-peptides") return "cream-my-skin";

  return handle;
};

const getProductFromStateByHandle = (state, handle) => {
  const products = state.products.list;
  return products.find((product) => product.handle === handle);
};

export default connect(mapStateToProps)(PageProductDetails);
