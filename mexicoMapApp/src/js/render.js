/**
 * Created by 1 on 06.12.2015.
 */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Root from "./components/root.js";
import store from "./store.js"

export default () => {
  ReactDOM.render(
      <Provider store={store}>
        <Root/>
      </Provider>,
      document.getElementById("root")
  );
};