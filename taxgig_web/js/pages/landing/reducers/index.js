import Constants from "../constants";

const initialState = {
  isInputVisible: false,
  faq_categories: [],
  loadingFaqCategories: false,
  loadingFaqCategory: false,
  loadingFaq: false,
  faqs: [
    {name: "Title 1", count: 23},
    {name: "Title 2", count: 10},
    {name: "Title 3", count: 55},
  ], 
  categories: [
    {name: "Article 11"},
    {name: "Article 21"},
    {name: "Article 31"},
    {name: "Article 41"}
  ]
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SHOW_EMAIL_INPUT:
      return {
        ...state,
        isInputVisible: true,
      };

    case Constants.HIDE_EMAIL_INPUT:
      return {
        ...state,
        isInputVisible: false,
      };

    case Constants.SUBMIT_EMAIL_SUCCESSFUL:
      return {
        ...state,
        isInputVisible: false,
      };

    case Constants.FETCH_FAQ_CATEGORIES:
      return {
        ...state,
        loadingFaqCategories: true,
      };

    case Constants.FETCH_FAQ_CATEGORIES_SUCCESS:
      return {
        ...state,
        loadingFaqCategories: false,
        faq_categories: action.faq_categories
      };

    case Constants.FETCH_FAQ_CATEGORIES_ERROR:
      return {
        ...state,
        loadingFaqCategories: false,
      };

    default:
      return state;
  }
}
