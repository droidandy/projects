// CSS
import "../css/app.css";
// import "../css/reset.css";
import "../css/fonts.css";
import "../css/landing_animations.css";
import "../css/swiper.css";

// APP
import React from "react";
import ReactDOM from "react-dom";
import { store, history } from './application/store';
import Root from "./application/containers/root";

const target = document.getElementById("root_container");
const node = <Root routerHistory={history} store={store} />;

ReactDOM.render(node, target);

