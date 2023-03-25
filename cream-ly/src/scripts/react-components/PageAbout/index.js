import React, { Component } from "react";
import InstagramEmbed from "react-instagram-embed";

import "./index.scss";
import MessageUs from "@Components/SharedComponents/MessageUs";
import PromoAdvantages from "@Components/SharedComponents/PromoAdvantages";
import InstagramWidget from "@Components/SharedComponents/InstagramFeedback";
import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";
import PageLink from "@Components/Structure/PageLink";

import { translate } from "@Core/i18n";
import { connect } from "@Components/index";

@translate(
  {
    header: "О Cream.ly",
    about: `CREAM.LY молодая семейная компания, по-хорошему помешанная на
  физиологичном натуральном уходе за кожей. Находимся мы в
  Нидерландах, а наше производство с командой технологов и химиков,
  таких же помешанных на создании лучшего натурального ухода - в
  Великобритании. И пока вы заполняете квиз, мы уже начинаем думать о
  том, что именно сейчас нужно вашей коже.`,
    ownerText: `Я очень не хотела создавать еще одну линейку непонятных баночек
  со странными составами - мой план был создать решение -
  полноценное уходовое решение для конкретной кожи`,
    owner: `Алена, создатель бренда CREAM.LY`,
    advantages: `Понимаете, больше не нужно думать, что сейчас важнее вашей коже -
  витамин С или гилауроновая кислота, а сколько нужно ночных кремов,
  а нужен ли еще серум - принципы CREAM.LY - это минимально
  необходимый, но достаточный уход со всем необходимым внутри. Вы
  заполняете квиз и мы понимаем, как восстановить вашу кожу так,
  чтобы она сама вспомнила, как функционировать правильно.`,
    quiz: `ЗАПОЛНИТЬ КВИЗ`,
  },
  "PageAbout"
)
class PageAbout extends Component {
  render() {
    return (
      <div className="ComponentPageAbout">
        <div className="imgTop" />

        <Header isPageHeader text={this.t("header")} />
        <p>{this.t("about")}</p>

        <div className="imgAlena" />

        <blockquote className="blockquote">
          <p>{this.t("ownerText")}</p>
          <h4>{this.t("owner")}</h4>
        </blockquote>
        <p>{this.t("advantages")}</p>

        <div className="spacingBottom">
          <PageLink pageType={"PAGE_QUIZ_OR_RESULTS"}>
            <Button text={this.t("quiz")} />
          </PageLink>
        </div>

        {this.props.lang !== "en" && (
          <div className="embedly-card-hug">
            <InstagramEmbed
              url="https://www.instagram.com/p/BkueZVOgQZn/?taken-by=cream.ly"
              maxWidth={600}
              hideCaption
              injectScript
            />
          </div>
        )}
        <div className="spacingBottom" />
        <PromoAdvantages lang={this.props.lang} />
        <MessageUs lang={this.props.lang} />
        <div className="spacingBottom" />
        <InstagramWidget lang={this.props.lang} />
      </div>
    );
  }
}

export default connect()(PageAbout);
