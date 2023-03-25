import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "@Components/index";
import { translate } from "@Core/i18n";
import PageLink from "@Components/Structure/PageLink";

import QuizNotification from "./sections/QuizNotification";

import MobileMenuAnimation from "./sections/MobileMenuAnimation";

import PreferencesForm from "../Localization/PreferencesModal/sections/Form";
import SuggestionModal from "../Localization/SuggestionModal";
import CookiesAcceptModal from "../CookiesAcceptModal";
import RegionIcon from "./sections/RegionIcon";
import AccountIcon from "./sections/AccountIcon";
import Cart from "./sections/Cart";

import "./index.scss";
import MenuBurgerIcon from "./MenuBurgerIcon";
import MenuCrossIcon from "./MenuCrossIcon";

const HIDE_QUIZ_NOTIFICATION_ON_PAGES = [
  "/challenge",
  "/pages/recommendations/",
  "/pages/recommendations",
  "/pages/quiz/",
  "/pages/quiz",
  "/pages/video/",
  "/pages/video",
  "/account/register",
  "/cart",
  "/cart/",
];

const mapStateToProps = (state, ownProps) => {
  const isNotificaitonHidden = ownProps.isNotificaitonHidden
    ? ownProps.isNotificaitonHidden
    : HIDE_QUIZ_NOTIFICATION_ON_PAGES.includes(
        state.app.route.pathWithoutLocale
      );

  return {
    host: ownProps.host ? ownProps.host : state.theme.host,
    isMobileMenuOpen: ownProps.isMobileMenuOpen ? ownProps.isMobileMenuOpen : false,
    isNotificaitonHidden,
    isQuizReady: ownProps.isQuizReady
      ? ownProps.isQuizReady
      : state.quiz.isReady,
    cartCount: ownProps.cartCount
      ? ownProps.cartCount
      : state.checkout.itemsCount,
    isCustomerLoggedIn: ownProps.isCustomerLoggedIn
      ? ownProps.isCustomerLoggedIn
      : state.customer.id,
    rootURL: ownProps.rootURL ? ownProps.rootURL : state.app.route.root,
    quizURL: ownProps.quizURL ? ownProps.quizURL : state.quiz.url,
    assetURL: state.theme.assetURL ? state.theme.assetURL : "/",
    isShowCookiesModal: ownProps.isShowCookiesModal
      ? ownProps.isShowCookiesModal
      : !state.app.cookies.isAccepted && state.app.cookies.isRequired,
  };
};

@translate({}, "common")
class SiteHeader extends Component {
  
  statePrepare(props) {
    return {
      menu: props.menu ? props.menu : menuPrepare(this),
      host: props.host,
      isMobileMenuOpen: props.isMobileMenuOpen,
    };
  }
  constructor(props) {
    super(props);
    this.state = this.statePrepare(props);
  }

  componentDidUpdate(prevProp) {
    if (prevProp != this.props)
      this.setState(this.statePrepare(this.props));
  }

  setRegionPopupVisibility = (regionPopupVisibility) => {
    this.setState({
      regionPopupVisibility,
    });
  };
  
  
  toggleMenu = (e) => {
    e.preventDefault();
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  };

  render() {
    return (
      <div className="SiteHeader">
        <header className="Header main_header container sticky-top">
          <div className="row h-100 justify-content-between">
            <div className="col-5 d-block d-xl-none my-auto navbar-left">
              <button className="nav-trigger p-0" onClick={this.toggleMenu}>
                {this.state.isMobileMenuOpen
                  ? <MenuCrossIcon/>
                  : <MenuBurgerIcon />
                }
              </button>
            </div>

            <div className="d-none d-xl-block col-md-5">
              <nav>
                {this.state.menu.left.map((link, i) => {
                  return (
                    <a
                      key={i}
                      className={`d-inline
                            align-middle
                            p-5
                            ${i === 0 && "first"}
                            ${link.isHighlightOn && "highlight"}`}
                      href={link.url}
                    >
                      {link.title}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="logo col-2 text-center my-auto">
              <PageLink pageType="PAGE_HOME">
                <img
                  className="d-none d-xl-inline-block logo_md"
                  alt="Cream.ly Logo Desktop"
                />
                <img
                  className="d-inline-block d-xl-none logo_xs"
                  alt="Cream.ly Logo Mobile"
                />
              </PageLink>
            </div>

            <div className="col-5 cart_column p-0 my-auto">
              <nav className="float-right">
                {this.state.menu.right.map((link, i) => {
                  return (
                    <a
                      key={i}
                      className="d-none d-xl-inline p-5 "
                      href={link.url}
                    >
                      {link.title}
                    </a>
                  );
                })}

                <AccountIcon
                  isCustomerLoggedIn={this.props.isCustomerLoggedIn}
                />

                <RegionIcon
                  actionOnClick={() => {
                    this.setRegionPopupVisibility(
                      !this.state.regionPopupVisibility
                    );
                  }}
                />

                <Cart lang={this.props.lang} count={this.props.cartCount} />
              </nav>
            </div>
          </div>
        </header>
        {!this.props.isAnimationOff && this.state.isMobileMenuOpen && 
          <MobileMenuAnimation 
            menu={this.state.menu} 
            lang={this.props.lang} 
            actionOnClickRegionChange={()=>{this.setRegionPopupVisibility(
              !this.state.regionPopupVisibility
            );}}
           /> 
        }

        {this.props.isQuizReady && !this.props.isNotificaitonHidden && (
          <QuizNotification lang={this.props.lang} />
        )}

        <PreferencesForm
          setRegionPopupVisibility={this.setRegionPopupVisibility}
          regionPopupVisibility={this.state.regionPopupVisibility}
          {...this.props.regionSettings}
          lang={this.props.lang}
        />

        <CookiesAcceptModal
          lang={this.props.lang}
          isShow={this.props.isShowCookiesModal}
        />

        <SuggestionModal
          lang={this.props.lang}
          setRegionPopupVisibility={this.setRegionPopupVisibility}
        />

       {/*  <hr/>
       props {JSON.stringify(this.props)}
       <hr/>
        state {JSON.stringify(this.state)}
  */}
      </div>
    );
  }
}

export default connect(mapStateToProps)(SiteHeader);

const menuData = {
  left: [
    { url: "/pages/quiz", key: "quiz", isHighlightOn: true },
    { url: "/pages/products", key: "products" },
    { url: "/pages/videos", key: "videos", isHiddenEN: true },
  ],
  right: [
    { url: "/pages/about", key: "about" },
    { url: "/pages/faq", key: "faq" },
  ],
  footer: [
    { url: "/account", key: "account.view" },
    { url: "/pages/contact-us", key: "contact" },
    { url: "/pages/shipment-information", key: "shippingPolicy" },
    {
      url: "/pages/terms-and-conditions-creamly",
      key: "termsAndConditions",
    },
    { url: "/pages/privacy-policy", key: "privacyPolicy" },
    { url: "/blogs/beauty/", key: "blog", isHiddenEN: true },
  ],
};

export function menuPrepare(component) {
  const linkPrepare = (link) => {
    if (link.isHiddenEN && component.props.lang == "en")
      return null;
    if (link.isHiddenRU && component.props.lang == "ru") return null;

    link.title = component.t("menu." + link.key);

    if (link.url == "/pages/quiz" && component.props.isQuizReady)
      return { ...link, url: component.props.quizURL };

    return {
      ...link,
      url: component.props.rootURL + link.url,
    };
  };

  let newMenu = {};
  newMenu.left = menuData.left.map(linkPrepare).filter((link) => link);
  newMenu.right = menuData.right.map(linkPrepare).filter((link) => link);
  newMenu.footer = menuData.footer
    .map((link) => ({
      ...link,
      url: mapFooterLink(link.url, component.props.host),
      key: changeKey(link.url, link.key, component.props.isCustomerLoggedIn),
    }))
    .map(linkPrepare)
    .filter((link) => link);

  return newMenu;
}

function changeKey(url, key, isCustomerLoggedIn) {
  if (url === "/account") {
    return isCustomerLoggedIn ? "account.login" : "account.view";
  }
  return key;
}

function mapFooterLink(url, host) {
  if (url.key === "blog" && host != "cream.ly") return null;

  if (host === "creamly.by") {
    if (url === "/pages/terms-and-conditions-creamly")
      return "/pages/terms-and-conditions-by";
    if (url === "/pages/privacy-policy") return "/pages/privacy-policy-by";
  } else if (host == "creamly.ru") {
    if (url === "/pages/terms-and-conditions-creamly")
      return "/pages/terms-and-conditions-ru";
    if (url === "/pages/privacy-policy") return "/pages/privacy-policy-ru";
  }

  return url;
}

SiteHeader.propTypes = {
  assetURL: PropTypes.string,
  cartCount: PropTypes.number,
  host: PropTypes.string,
};
