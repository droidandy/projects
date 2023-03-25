import React from "react";
import {Helmet} from "react-helmet";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import invariant from "invariant";
import configRoutes from "../routes";
import { ApolloProvider } from "@apollo/react-hooks";

import { client } from "../utils/apollo_client";

export default class Root extends React.Component {
  // invariant throws errors only in production (https://github.com/zertosh/invariant#readme)
  // Using ConnectedRouter insted of BrowserRouter to sync with redux
  // https://stackoverflow.com/questions/53943345/what-is-the-difference-between-browserrouterimport-from-react-router-dom-and-c
  _renderRouter(store) {
    const { routerHistory } = this.props;

    invariant(
      routerHistory,
      "<Root /> needs either a routingContext or routerHistory to render."
    );

    return (
      <ConnectedRouter history={routerHistory}>
        {configRoutes(store)}
      </ConnectedRouter>
    );
  }

  render() {
    const { store } = this.props;

    console.log(client);

    return (
      <Provider store={store}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>TaxGig Inc. - Freelance Pros for any tax needs</title>
          <link rel="canonical" href="https://taxgig.com/" />
          <meta name="description" content={"Whether you need a tax return, a monthly bookkeeping or any other financial high-qualified service, TaxGig is the best place to resolve each of your concerns by instantly matching you with a Pro."} />
        </Helmet>
        <ApolloProvider client={client}>
          {this._renderRouter(store)}
        </ApolloProvider>
      </Provider>
    );
  }
}
