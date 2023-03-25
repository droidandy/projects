import React from "react";
import "./index.scss";

import SubHeader from "@Components/Structure/SubHeader";
import Button from "@Components/Structure/Button";
import PropTypes from "prop-types";

import { translate } from "@Core/i18n";
@translate(
  {
    consultationPromo: {
      header: "нужен индивидуальный подход?",
      button: "Узнать подробности",
      descriptionPart1: "Персональные рекомендации<br/>для вашего лица",
      descriptionPart2:
        "Консультация с автором видео-курсов,<br/>доктором-косметологом, неврологом  Натальей Чичук",
    },
  },
  "common"
)
export default class ConsultationPromo extends React.Component {
  render() {
    return (
      <section className="componentConsultationPromo">
        <SubHeader text={this.t("consultationPromo.header")} />
        <div
          key="description1"
          className="description"
          dangerouslySetInnerHTML={{
            __html: this.t("consultationPromo.descriptionPart1"),
          }}
        ></div>
        <div
          key="description2"
          className="description2"
          dangerouslySetInnerHTML={{
            __html: this.t("consultationPromo.descriptionPart2"),
          }}
        ></div>
        <Button
          white={true}
          text={this.t("consultationPromo.button")}
          pageType="PAGE_PRODUCT_DETAILS"
          handle="individual-face-massage"
        />
      </section>
    );
  }
}

ConsultationPromo.propTypes = {
  lang: PropTypes.string,
};
