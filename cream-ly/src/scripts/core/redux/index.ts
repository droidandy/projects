// @ts-nocheck
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import videosFilter from "../../react-components/PageVideos/VideosFilter/reducers";
import quiz from "./quiz";
import customer from "./customer";
import products from "./products";
import blog from "./blog";
import checkout from "./checkout";
import theme from "./theme";
import { isDebugOn } from "../app/renderContoller";
import app from "./app";
import { setLang } from "./lang";

import StoreShape from "./shape";

const rootReducer = combineReducers({
  blog,
  products,
  videosFilter,
  quiz,
  customer,
  checkout,
  theme,
  app,
});

const composeEnhancers =
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  isDebugOn()
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
);

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.

/**
 * Create a Redux store holding the state of app.
 * Its API is { subscribe, dispatch, getState }
 */

const store = createStore(rootReducer, enhancer);
export default store;

export function newStore(lang) {
  if (lang) setLang(lang);
  return createStore(rootReducer, enhancer);
}
