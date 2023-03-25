import React from "react";
import { connect } from "@Components/index";

import "./index.scss";

import actionChangeSelectedProducts from "./actions/changeSelectedProducts";
import actionClickAddToCart from "./actions/clickAddToCart";

import SelectedOptions from "./sections/SelectedOptions";
import ResultsSummary from "./sections/Summary";
import ProductsList from "./sections/ProductsList";
import Error from "@Components/Structure/Error";
import Header from "@Components/Structure/Header";
import MessageUs from "@Components/SharedComponents/MessageUs";
import PromoAdvantages from "@Components/SharedComponents/PromoAdvantages";
import InstagramFeedback from "@Components/SharedComponents/InstagramFeedback";

import getFeedbacks from "@Core/app/content/feedbacks";

import { translate } from "@Core/i18n/";
import ProductFeedback from "@Components/SharedComponents/ProductFeedbacks";

@translate(
  {
    error: {
      noProducts: "Должен быть выбран хотя бы один продукт",
    },
    header: {
      yourQuiz: "ваша кожа и цели по уходу",
      recommendation: "ваш персональный уход",
    },
    recommendationIntro:
      "Исходя из ваших ответов, мы предлагаем вам следующие средства по уходу за вашей кожей",
  },
  "PageQuizResult"
)
class PageQuizResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProductsSKU: this.props.selectedProductsSKU,
      isLoading: this.props.isLoading,
    };
  }

  checkboxHandler = (checkedSKU) => {
    let skuList = this.state.selectedProductsSKU;

    if (this.state.selectedProductsSKU.includes(checkedSKU)) {
      skuList = skuList.filter((sku) => sku != checkedSKU);
    } else {
      skuList.push(checkedSKU);
    }

    this.setState({
      selectedProductsSKU: skuList,
    });

    if (this.props.onSelectUpdate) this.props.onSelectUpdate(skuList);
  };

  addToCartHandler = () => {
    const setProperties = (handle) => {
      const { storeQuiz } = this.props;
      let properties = {};

      if (handle) {
        if (storeQuiz.productsList[handle]) {
          if (storeQuiz.productsList[handle].skinType) {
            properties["Skin Type"] = storeQuiz.productsList[handle].skinType;
          }
          if (storeQuiz.productsList[handle].goals) {
            properties["Skin Care Goals"] = storeQuiz.productsList[handle].goals.join()
          }
        }
      }

      return properties;
    }

    const items = this.props.products
      .filter((product) => this.state.selectedProductsSKU.includes(product.sku))
      .filter((product) => !product.isOutOfStock)
      .map((product) => ({
        id: product.variantId,
        quantity: 1,
        properties: setProperties(product.handle),
      }));

    this.setState({ isLoading: true });

    if (this.props.onAddToCart) {
      this.props.onAddToCart(items)
    };
  };

  /*
  componentDidUpdate(prevProps, prevState, snapshot) {
    //  console.log("PageQuizResult componentDidUpdate", prevState, this.state);
  } */

  renderSummary() {
    return this.state.selectedProductsSKU.length ? (
      <ResultsSummary
        products={this.props.products}
        //videos={this.props.videos}
        isLoading={this.state.isLoading}
        selectedProductsSKU={this.state.selectedProductsSKU}
        handleAddToCartClick={this.addToCartHandler}
        lang={this.props.lang}
      />
    ) : (
      <Error text={this.t("error.noProducts")} />
    );
  }
  render() {
    const feedbacks = getFeedbacks(this.props.lang);

    const hasGoals =
      this.props.quiz.skinCareGoals || this.props.quiz.skinCareGoals.length;

    return (
      <div className="componentPageQuizResult">
        <Header text={this.t("header.yourQuiz")} />

        <SelectedOptions
          skinType={this.props.quiz.skinType}
          goals={this.props.quiz.skinCareGoals}
          lang={this.props.lang}
        />

        {hasGoals && (
          <>
            <Header isPageHeader text={this.t("header.recommendation")} />
            <div className="recommendationIntro">
              {this.t("recommendationIntro")}
            </div>
          </>
        )}
        {this.renderSummary()}
        {this.props.products && (
          <ProductsList
            products={this.props.products}
            selectedProductsSKU={this.state.selectedProductsSKU}
            handleSelect={this.checkboxHandler}
            lang={this.props.lang}
            isDisplaySKU={this.props.isDisplaySKU}
            /* trackTimerUpdateCallback={(type, time) => {
              if (type === "start" || type === "stop") {
                console.log("ProductsList", type, time);
              }
            }} */
          />
        )}

        <Header text={this.t("header.recommendation")} />
        {this.renderSummary()}

        <ProductFeedback
          title={"CREAM.LY"}
          feedbacks={feedbacks}
          lang={this.props.lang}
        />

        <PromoAdvantages lang={this.props.lang} />
        <MessageUs lang={this.props.lang} />
        <InstagramFeedback lang={this.props.lang} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const productsListFlat = (productsArr) => {
    const products =
      ownProps.lang === "ru" ||
      state.app.localizationSettings.languageCode === "ru"
        ? productsArr
        : productsArr.filter(({ handle }) => !handle.includes("video"));

    return products.reduce((acc, product) => {
      const productVariants = Object.keys(product.variants).map(
        (variantSKU) => {
          const variant = product.variants[variantSKU];
          return {
            title: product.title,
            id: product.id,
            handle: product.handle,
            isHiddenInLang: product.isHiddenInLang,
            isOutOfStock: variant.isOutOfStock,
            image: variant.image,
            images: product.images,
            videos: product.videos,
            sizeInMl: product.variants[variantSKU].sizeInMl || product.sizeInMl,
            price: product.variants[variantSKU].price,
            sku: variantSKU,
            variantId: variant.id,
          };
        }
      );

      return [...acc, ...productVariants];
    }, []);
  };

  const recommendedSKUs = ownProps.recommendedSKUs
    ? ownProps.recommendedSKUs
    : state.quiz.skuList;

  const lang = ownProps.lang ? ownProps.lang : state.theme.lang;

  const handlesToShowAlways = [
    "cream-my-skin",
    "flower-powder-my-skin",
    "cream-my-skin-with-peptides",
  ];

  const recommendedProducts = productsListFlat(state.products.list)
    .filter((product) => recommendedSKUs.includes(product.sku))
    .filter(
      (product) =>
        !product.isOutOfStock || handlesToShowAlways.includes(product.handle)
    )
    .sort(
      (productA, productB) =>
        recommendedSKUs.indexOf(productA.sku) -
        recommendedSKUs.indexOf(productB.sku)
    );

  let selectedProductsSKU = ownProps.selectedProductsSKU
    ? ownProps.selectedProductsSKU
    : state.quiz.selectedSKU;

  selectedProductsSKU =
    Array.isArray(selectedProductsSKU) && selectedProductsSKU.length
      ? selectedProductsSKU
      : recommendedProducts
          .filter(({ handle }) => !handle.includes("video"))
          .map((product) => product.sku);

  selectedProductsSKU = selectedProductsSKU.filter(
    (sku) =>
      recommendedProducts.filter(
        (product) => product.sku == sku && !product.isOutOfStock
      ).length > 0
  );

  return {
    storeQuiz: state.quiz,
    quiz: ownProps.quiz ? ownProps.quiz : state.quiz,
    onSelectUpdate: ownProps.onSelectUpdate
      ? ownProps.onSelectUpdate
      : actionChangeSelectedProducts,
    onAddToCart: ownProps.onAddToCart
      ? ownProps.onAddToCart
      : actionClickAddToCart,
    products: recommendedProducts,
    selectedProductsSKU,
  };
};

const mapDispatchToProps = (dispatch, getState) => {
  return {
    onAddToCart: (items) => dispatch(actionClickAddToCart(items)),
    onSelectUpdate: (skuList) =>
      dispatch(actionChangeSelectedProducts(skuList)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageQuizResult);
