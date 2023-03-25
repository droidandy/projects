import React from "react";
import { connect } from "@Components/index";

import { translate } from "@Core/i18n";

import Header from "@Components/Structure/Header";
import "./index.scss";
import PropTypes from "prop-types";

@translate(
  {
    header: "за что нас ценят",
    minimal: "МИНИМАЛИЗМ",
    minimalText:
      "Наши 2-4 средства заменяют 8-10 других средств по уходу за лицом",
    cert: "Сертификат качества Евросоюза",
    certText:
      "Все средства произведены в лаборатории в Великобритании и имеют необходимые сертификаты качества",
    effectiveness: "ЭФФЕКТИВНОСТЬ",
    effectivenessText:
      "Перед выбором линейки продуктов мы создали около 1000 различных составов и собрали наиболее комплексные, эффективные и работающие не в теории, а на практике",
    handmade: "Чистота",
    handmadeText: `Составы наших средств регулярно получают самую высокую оценку у таких экспертов, как&nbsp;<a href="https://www.instagram.com/p/BuEcZI2A3ng/" target="_blank">Alona_Eco</a>`,
    natural: "НАТУРАЛЬНОСТЬ",
    naturalText:
      "Все наши средства на 98,5% натуральны. Почему 98,5%? Например, мы используем синтетическую мочевину для увлажнения кожи, но это и хорошо",
    animals: "НЕ ТЕСТИРУЕМ НА ЖИВОТНЫХ",
    animalsText: "Потому что мы любим животных",
  },
  "PromoAdvantages"
)
class PromoAdvantages extends React.Component {
  render() {
    return (
      <div className="componentPromoAdvantages">
        <Header text={this.t("header")} />
        <div className="spacingBottomMedium"></div>
        <div className="row justify-content-center">
          <div className="item col-6 col-sm-4 spacingBottomMedium">
            <div className="icon_img minimal"></div>
            <h4>{this.t("minimal")}</h4>
            <p>{this.t("minimalText")}</p>
          </div>

          <div className="item col-6 col-sm-4 spacingBottomMedium">
            <div className="icon_img certificate"></div>
            <h4>{this.t("cert")}</h4>
            <p>{this.t("certText")}</p>
          </div>

          <div className="item col-6 col-sm-4 spacingBottomMedium">
            <div className="icon_img effectiveness"></div>
            <h4>{this.t("effectiveness")}</h4>
            <p>{this.t("effectivenessText")}</p>
          </div>

          <div className="item col-6 col-sm-4 spacingBottomMedium">
            <div className="icon_img handmade"></div>
            <h4>{this.t("handmade")}</h4>
            <p dangerouslySetInnerHTML={{ __html: this.t("handmadeText") }}></p>
          </div>

          <div className="item col-6 col-sm-4 spacingBottomMedium">
            <div className="icon_img natural"></div>
            <h4>{this.t("natural")}</h4>
            <p>{this.t("naturalText")}</p>
          </div>

          {this.props.showAnimals && (
            <div className="item col-6 col-sm-4 spacingBottomMedium">
              <div className="icon_img animal_love"></div>
              <h4>{this.t("animals")}</h4>
              <p>{this.t("animalsText")}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStoreToProps = (state, ownProps) => {
  return {
    showAnimals:
      ownProps.showAnimals != undefined ? ownProps.showAnimals : true,
  };
};

export default connect(mapStoreToProps)(PromoAdvantages);

PromoAdvantages.propTypes = {
  showAnimals: PropTypes.bool,
};
