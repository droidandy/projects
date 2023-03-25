import React from "react";
import { connect } from "@Components/index";

import "./index.scss";
import Price from "../../Price";
import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";
import Error from "@Components/Structure/Error";
import Quiz from "./questions";
import VideosGroup from "../../VideosGroup";

import * as Actions from "./actions/";
import { translate } from "@Core/i18n";

@translate(
  {
    header: "Не знаете, что выбрать?",
    description: `Для того, чтобы подобрать максимально эффективные для вас техники, выберите ваши цели ухода <i class="fa fa-arrow-down" aria-hidden="true"></i>`,
    error: "Как минимум одна цель должна быть выбрана",
    total: "видео по цене",
    buttonShowRecommendations: "Показать рекомендации",
    buttonAddToCart: "Добавить в корзину"
  },
  "VideosFilter"
)
class VideosFilter extends React.Component {
  constructor(props) {
    super(props);

    const {
      videos,
      goals,
      isButtonResultsClicked,
      isButtonAddToCartClicked,
      videosHandlesSelectedByUser,
      onClickButtonResults,
      onClickButtonAddToCart,
      onClickBuyButton
    } = props;

    this.state = {};

    if (props.goals && props.goals.length) props.onGoalsChange(props.goals);
  }

  isError() {
    const goals = this.props.goals;
    return !goals || goals.length === 0;
  }

  render() {
    const videos = this.props.videos
      .filter(({ handle }) => this.props.selectedVideoHandles.includes(handle))
      .map(video => {
        const isPurchased = this.props.purchasedVideosHandles.includes(
          video.handle
        );
        const isSelected = this.props.videosHandlesSelectedByUser.includes(
          video.handle
        );

        return {
          ...video,
          isPurchased,
          isSelected: isSelected && !isPurchased
        };
      });

    const selectedVideos = videos.filter(
      ({ handle, isPurchased }) =>
        this.props.videosHandlesSelectedByUser.includes(handle) && !isPurchased
    );

    const videosHandlesForCart = selectedVideos.map(({ handle }) => handle);

    const selectedVideosLength = selectedVideos.length;

    return (
      <div className="componentVideosFilter">
        <Header text={this.t("header")} sub={true} />
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: this.t("description") }}
        />
        <div className="filter">
          {this.props.isButtonResultsClicked && this.isError() ? (
            <Error text={this.t("error")} />
          ) : null}
          <Quiz
            skinGoals={this.props.goals}
            onChange={this.props.onGoalsChange}
          />
          <div className="spacingSmall" />
          {!this.props.isButtonResultsClicked ||
          this.isError() ||
          this.props.videos.length === 0 ? (
            <Button
              extra={{ "data-test": "buttonVideosFilter" }}
              onClick={this.props.onClickButtonResults}
              green={true}
              text={this.t("buttonShowRecommendations")}
            />
          ) : (
            <React.Fragment>
              <VideosGroup
                videos={videos}
                handleSelect={this.props.selectVideoHandle}
              />
              {selectedVideosLength > 0 && (
                <>
                  <div className="total">
                    <strong>{selectedVideosLength}</strong> {this.t("total")}
                  </div>
                  <div className="price">
                    <Price lang={this.props.lang} prices={selectedVideos} />
                  </div>
                </>
              )}

              <Button
                isLoading={
                  this.props.isButtonAddToCartClicked &&
                  !this.props.isRequestComplete
                }
                green={true}
                text={`${this.t("buttonAddToCart")} ${
                  selectedVideosLength > 0
                    ? "(" + selectedVideosLength + ")"
                    : ""
                }`}
                disabled={!selectedVideosLength}
                onClick={() =>
                  this.props.onClickBuyButton(videosHandlesForCart)
                }
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStoreToProps = (state, ownProps) => {
  return {
    isButtonResultsClicked:
      !state.videosFilter.isButtonResultsClicked &&
      typeof ownProps.isButtonResultsClicked !== "undefined"
        ? ownProps.isButtonResultsClicked
        : state.videosFilter.isButtonResultsClicked,
    isButtonAddToCartClicked:
      !state.videosFilter.isButtonAddToCartClicked &&
      typeof ownProps.isButtonAddToCartClicked !== "undefined"
        ? ownProps.isButtonAddToCartClicked
        : state.videosFilter.isButtonAddToCartClicked,
    goals:
      Array.isArray(ownProps.goals) && ownProps.goals.length
        ? ownProps.goals
        : state.videosFilter.selectedGoals,

    isRequestComplete: state.videosFilter.isRequestComplete,

    selectedVideoHandles: state.videosFilter.videosHandles,
    videosHandlesSelectedByUser: state.videosFilter.videosHandlesSelectedByUser,
    videos: state.products.videos,
    purchasedVideosHandles: ownProps.purchasedVideosHandles
      ? ownProps.purchasedVideosHandles
      : state.customer.videos
  };
};

const mapDispatchToProps = (dispatch, getState) => {
  return {
    // dispatching plain actions
    onGoalsChange: goals => dispatch(Actions.changeGoals(goals)),
    onClickButtonResults: component => {
      dispatch({ type: Actions.types.ACTION_CLICK_SHOW_RESULT });

      /* if (component.isError()) {
        if (typeof component.props.onError === "function")
          component.props.onError(component.props);
      } */
    },
    onClickBuyButton: selectedVideosHandles =>
      dispatch(Actions.clickAddToCart(selectedVideosHandles)),
    selectVideoHandle: handle => dispatch(Actions.selectVideoHandle(handle))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(VideosFilter);
