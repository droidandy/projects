import React, { Component } from "react"

import { NotificationContainer } from "./libs/Notifications"
import Routes from "./Routes"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/es/integration/react"
import configureStore from "./store"
import SegmentHelper from "./libs/SegmentHelper"
import LocalStorageService from "./libs/TokenService";
import {track} from "./libs/helpers";
const { persistor, store } = configureStore()
const APP_VERSION = "0.0.3"
const APP_VERSION_ATTR = "apphud.frontend.version"

class App extends Component {
  componentDidMount() {
    if (!LocalStorageService.getSwitchUserToken() && window.analytics) {
      window.analytics.page(
          null,
          null,
          {},
          {
            integrations: { All: true, Webhooks: false }
          }
      )
      window.segmentHelper = new SegmentHelper()
    }
    if (window.Intercom !== undefined) {
      window.Intercom("onShow", () => track("intercom_opened"));
    }
  }

  cleanStorage = () => {
    localStorage.setItem("users.filters", "[]")
    localStorage.setItem("events.filters", "[]")
  };

  componentWillMount() {
    const version = localStorage.getItem(APP_VERSION_ATTR)

    if (!version || version !== APP_VERSION) {
      this.cleanStorage()
      localStorage.setItem(APP_VERSION_ATTR, APP_VERSION)
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NotificationContainer />
          <Routes />
        </PersistGate>
      </Provider>
    )
  }
}

export default App
