import React from "react";
import { connect } from "@Components/index";

import {
  recommendedProductsList,
  getOilSKU,
  getCreamSKU,
  allSkinTypeGoals,
} from "@Core/quiz";

import Button from "@Components/Structure/Button";

import "./index.scss";
import PropTypes from "prop-types";
import { translate } from "@Core/i18n";

@translate({}, "PageQuiz")
class ProductQuiz extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.handle) {
      throw new Error("productHandle is not defined");
    }

    this.state = {
      skinType: props.skinType,
      goals: filterGoalsAndKeepOnlyAllowed(props.goals),
      isButtonClicked: false,
      errors: {},
    };

    this.refSkinType = React.createRef();
    this.refSkinGoals = React.createRef();

    this.handleSkinGoalChange = this.handleSkinGoalChange.bind(this);
    this.handleSkinTypeChange = this.handleSkinTypeChange.bind(this);
  }

  componentDidMount() {
    this.setVariant([...this.state.goals], this.state.skinType);
  }

  translate() {}
  skinTypesList() {
    const list = {};
    list.normal = this.t("PageQuiz:skinTypes.normal");
    list.oily = this.t("PageQuiz:skinTypes.oily");
    list.dry = this.t("PageQuiz:skinTypes.dry");
    list.mixed = this.t("PageQuiz:skinTypes.mixed");

    const html = [];
    for (const [key, value] of Object.entries(list)) {
      html.push(
        <option data-quiz-question="skinType" key={key} value={key}>
          {value}
        </option>
      );
    }

    return html;
  }

  setError({ skinType, skinGoals }, isSubmit) {
    const errors = {
      skinType: this.t("PageQuiz:errorSkinType"),
      skinGoals: this.t("PageQuiz:errorGoals"),
    };

    if (isSubmit) {
      this.setState({
        errors: {
          skinType: skinType ? errors.skinType : null,
          skinGoals: skinGoals ? errors.skinGoals : null,
        },
      });
    } else {
      if (this.state.errors.skinType) {
        setTimeout(() => {
          this.setState({
            errors: {
              ...this.state.errors,
              skinType: skinType ? errors.skinType : null,
            },
          });
        }, 0);
      }
      if (this.state.errors.skinGoals) {
        setTimeout(() => {
          this.setState({
            errors: {
              ...this.state.errors,
              skinGoals: skinGoals ? errors.skinGoals : null,
            },
          });
        }, 0);
      }
    }
  }
  goalsList() {
    const list = {};
    list.wrinkles = this.t("PageQuiz:goals.wrinkles");
    list.acne = this.t("PageQuiz:goals.acne");
    list.sensitive = this.t("PageQuiz:goals.sensitive");
    list.dehydrated = this.t("PageQuiz:goals.dehydrated");
    list.pimple = this.t("PageQuiz:goals.pimple");
    list.lighten = this.t("PageQuiz:goals.lighten");
    if (this.props.handle == "cream-my-skin")
      list.antioxidant = this.t("PageQuiz:goals.antioxidant");

    const goals = this.props.goals ? this.props.goals : [];
    const html = [];
    for (const [key, value] of Object.entries(list)) {
      html.push(
        <div key={key} className="bold_option_value ">
          <label data-quiz-question="skinGoals" data-quiz-value={key}>
            <span className="bold_option_value_element">
              <input
                type="checkbox"
                onChange={this.handleSkinGoalChange}
                value={key}
                name="goals"
                defaultChecked={goals.includes(key)}
              />
            </span>
            <span className="bold_option_value_title">{value}</span>
          </label>
        </div>
      );
    }

    return html;
  }

  setVariant(skinGoals, skinType) {
    const handle = this.props.handle;
    let variant = "";
    if (handle === "cream-my-skin")
      variant = getCreamSKU(null, skinType, skinGoals).sku;
    if (handle === "nourish-my-skin")
      variant = getOilSKU(null, skinType, skinGoals).sku;

    this.props.onChange(variant);
  }

  handleSkinGoalChange(e) {
    const goal = e.target.value;
    const goals = this.state.goals;

    !goals.has(goal) ? goals.add(goal) : goals.delete(goal);
    this.checkForErrors();

    this.setVariant([...goals], this.state.skinType);
  }

  handleSkinTypeChange(e) {
    const value = e.target.value != "0" ? e.target.value : undefined;
    this.setState({ skinType: value });
    this.setVariant([...this.state.goals], value);
  }

  checkForErrors() {
    const skinType = this.state.skinType;
    const skinGoals = [...this.state.goals];
    this.setError({ skinType: !skinType, skinGoals: skinGoals.length === 0 });

    if (!this.state.isButtonClicked) return;
  }

  getProduct(productHandle, skinType, skinGoals) {
    const products = recommendedProductsList(skinType, skinGoals);

    if (productHandle === "cream-my-skin" && !products[productHandle]) {
      productHandle = "cream-my-skin-with-peptides";
    }
    if (
      productHandle === "cream-my-skin-with-peptides" &&
      !products[productHandle]
    ) {
      productHandle = "cream-my-skin";
    }

    return products[productHandle];
  }

  handleOnSubmit() {
    this.setState({ isButtonClicked: true }, () => {
      const skinType = this.state.skinType;
      const skinGoals = [...this.state.goals];
      this.setError(
        { skinType: !skinType, skinGoals: skinGoals.length === 0 },
        true
      );

      if (!skinType || skinGoals.length === 0) {
        if (typeof this.props.onError === "function")
          this.props.onError(skinType, skinGoals);

        return this.checkForErrors();
      } else {
        const product = this.getProduct(this.props.handle, skinType, skinGoals);

        if (product.variantId && typeof this.props.onComplete === "function")
          this.props.onComplete(product.variantId, skinType, skinGoals);
      }
    });
  }

  componentDidUpdate(prevProp, prevState) {
    if (
      this.state.goals !== prevState.goals ||
      this.state.skinType !== prevState.skinType
    )
      this.checkForErrors();
  }

  render() {
    return (
      <form
        className="componentProductQuiz product-form"
        data-section="product-template"
      >
        <div className="bold_options">
          <div className="bold_option_set">
            <div
              ref={this.refSkinType}
              className={`bold_option bold_option_dropdown ${!!this.state.errors
                .skinType && "bold_option_error"}`}
            >
              <label>
                <span className={`bold_option_title`}>
                  {!!this.state.errors.skinType
                    ? this.state.errors.skinType
                    : this.t("PageProductDetails:skinType")}
                </span>

                <span className="bold_option_element">
                  <select
                    onChange={this.handleSkinTypeChange}
                    defaultValue={this.props.skinType}
                    name="skinType"
                  >
                    <option value="0">
                      -- {this.t("PageProductDetails:skinTypeEmptyValue")} --
                    </option>
                    {this.skinTypesList()}
                  </select>
                </span>
              </label>
            </div>
            <div
              ref={this.refSkinGoals}
              className={`bold_option bold_option_checkboxmulti ${!!this.state
                .errors.skinGoals && "bold_option_error"}`}
            >
              <div className="bold_option_title ">
                {!!this.state.errors.skinGoals
                  ? this.state.errors.skinGoals
                  : this.t("PageProductDetails:skinCareGoals")}
              </div>

              <span className="bold_option_element">{this.goalsList()}</span>
            </div>
          </div>
        </div>

        {!this.props.isOutOfStock && (
          <div className="product-form__item product-form__item--submit text-center mt-md-0 mt-sm-3">
            <Button
              green={true}
              extra={{ "data-test": "buttonProductQuizSubmit" }}
              onClick={this.handleOnSubmit.bind(this)}
              text={this.t("PageProductDetails:buttonAddToCart")}
              disabled={this.props.variantIsOutOfStock}
            />
          </div>
        )}
      </form>
    );
  }
}

ProductQuiz.propTypes = {
  handle: PropTypes.string,
  skinType: PropTypes.string,
  goals: PropTypes.array,
  isScrollOff: PropTypes.bool,
  onError: PropTypes.func,
  onComplete: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
    goals: ownProps.goals ? ownProps.goals : state.quiz.skinCareGoals,
    skinType: ownProps.skinType ? ownProps.skinType : state.quiz.skinType,
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,
  };
};

export default connect(mapStateToProps)(ProductQuiz);

const filterGoalsAndKeepOnlyAllowed = (goals) => {
  return goals
    ? new Set([...goals].filter((goal) => allSkinTypeGoals.includes(goal)))
    : new Set();
};
