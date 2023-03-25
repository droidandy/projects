import React, { Component } from "react";
import { connect } from "@Components/index";
import { translate } from "@Core/i18n";

//import DeliveryLimit from "./DeliveryLimit";
import { menuPrepare } from "../SiteHeader";
import "./index.scss";

import PropTypes from "prop-types";

const url_instagram = "https://www.instagram.com/cream.ly/";
const url_facebook = "https://www.facebook.com/CREAMLY-1959936880896657/";
const url_telegram = "https://t.me/alenkacreamly";

const mapStateToProps = (state, ownProps) => {
  return {
    rootURL: ownProps.rootURL ? ownProps.rootURL : state.app.route.root,
    host: ownProps.host ? ownProps.host : state.theme.host,
    isCustomerLoggedIn: ownProps.isCustomerLoggedIn
      ? ownProps.isCustomerLoggedIn
      : Boolean(state.customer.id),
  };
};

@translate({}, "common")
class SiteFooter extends Component {
  render() {
    const host = this.props.host;

    const menuLinks = menuPrepare(this).footer;

    return (
      <footer className={"site-footer"} data-host={host}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 text-center">
              {/* <div className="delivery">
                <span className="bg">
                   <DeliveryLimit {...this.props} host={host} /> 
                </span>
              </div> */}
            </div>
            <div className="col-lg-6">
              <div className="payments">
                <img className="visa" />
                <img className="mastercard" />
                <img className="paypal" />
                <img className="ideal" />
                <img className="amex" />
                <img className="applepay" />
              </div>
            </div>
          </div>
          <nav className="d-none d-sm-block">
            <ul>
              {menuLinks.map((link, i) => {
                return (
                  <li key={i}>
                    <a href={link.url}>{link.title}</a>
                  </li>
                );
              })}
              <li>
                <a href={"mailto:" + this.props.email}>{this.props.email}</a>
              </li>
            </ul>
          </nav>
          <div className="share">
            <a href={url_instagram} target="_blank">
              <img className="instagram" alt="CREAM.LY Instagram" />
            </a>
            <a href={url_facebook} target="_blank">
              <img className="facebook" alt="CREAM.LY Facebook" />
            </a>
            <a href={url_telegram} target="_blank">
              <img className="telegram" alt="CREAM.LY Telegram" />
            </a>
          </div>
          <div className="made">
            <span>{this.t("footer.slogan")}</span>
          </div>
          <div className="copy">
            &copy; 2017-
            {new Date().toLocaleDateString("ru-RU", { year: "numeric" })}{" "}
            {"CREAM.LY"}
          </div>
        </div>
        {host == "creamly.by" && (
          <>
            <hr className="my-4" />
            <div className="container-fluid">
              <div className="legal">
                Представитель CREAM.LY в Республике Беларусь ИП Хмельницкий Олег
                Петрович, юр. адрес: 220004, г. Минск, ул. Заславская, д. 35,
                кв. 174. Свидетельство о регистрации №192812618 выдано
                10.05.2017 Минский горисполком. Интернет-магазин creamly.by
                зарегистрирован в торговом реестре РБ 22.08.2019 под № 458563.
                Время работы с понедельника по пятницу с 9:00 до 17:30.
              </div>
            </div>
          </>
        )}
      </footer>
    );
  }
}

SiteFooter.defaultProps = {
  email: "alena@cream.ly",
};

export default connect(mapStateToProps)(SiteFooter);

SiteFooter.propTypes = {
  host: PropTypes.string,
};
