import {
  trimSkinGoalsList,
  quiz2skuList,
  recommendedProductsList,
} from "../../quiz";
import { urlQuizOrResults } from "../../app/router";
import QuizStateShape from "./shape";

import videoRecomendations from "../../../react-components/PageVideos/VideosFilter/reducers/show_video_results";

const initialState = {
  skinType: null,
  skinCareGoals: [],
  videoGoals: [],
  url: null,

  isReady: false,

  skuList: [],
  productsList: [],
  productHandlesList: [],
  videos: [],
};

const ACTION_SET_QUIZ = "ACTION_SET_QUIZ";
const ACTION_QUIZ_CHANGE_SELECTED_PRODUCTS =
  "ACTION_QUIZ_CHANGE_SELECTED_PRODUCTS";
const ACTION_QUIZ_CLICK_ADD_TO_CART = "ACTION_QUIZ_CLICK_ADD_TO_CART";
const ACTION_QUIZ_ADD_TO_CART_COMPLETE = "ACTION_QUIZ_ADD_TO_CART_COMPLETE";

export const types = {
  ACTION_SET_QUIZ,
  ACTION_QUIZ_CHANGE_SELECTED_PRODUCTS,
  ACTION_QUIZ_CLICK_ADD_TO_CART,
  ACTION_QUIZ_ADD_TO_CART_COMPLETE,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTION_SET_QUIZ:
      action.quiz.skinCareGoals = trimSkinGoalsList(action.quiz.skinCareGoals);

      action.quiz.isReady =
        action.quiz.skinType &&
        Array.isArray(action.quiz.skinCareGoals) &&
        action.quiz.skinCareGoals.length > 0;

      action.quiz.url = urlQuizOrResults(
        action.quiz.skinType,
        action.quiz.skinCareGoals
      );

      action.quiz.skuList = action.quiz.isReady
        ? quiz2skuList(action.quiz.skinType, action.quiz.skinCareGoals)
        : [];

      action.quiz.productsList = action.quiz.isReady
        ? recommendedProductsList(
            action.quiz.skinType,
            action.quiz.skinCareGoals
          )
        : [];

      action.quiz.productHandlesList = action.quiz.isReady
        ? Object.keys(action.quiz.productsList)
        : [];

      action.quiz.videos = videoRecomendations(action.quiz.videoGoals).map(
        (video) => video.handle
      );

      return {
        ...state,
        ...action.quiz,
        selectedSKU: action.quiz.selectedSKU,
      };

    case types.ACTION_QUIZ_CHANGE_SELECTED_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          selected: action.products,
        },
      };

    default:
      return state;
  }
};
