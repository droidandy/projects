// @flow
import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import initApollo from 'lib/initApollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import initRedux from 'lib/initRedux';
import Cookies from 'universal-cookie';
import { CookiesProvider } from 'react-cookie';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { grey100, grey500, grey700 } from 'material-ui/styles/colors';

const palette = {
  primary1Color: grey500,
  primary2Color: grey700,
  primary3Color: grey100,
};

if (!process.tapEventInjected) {
  injectTapEventPlugin();
  process.tapEventInjected = true;
}

export default ComposedComponent =>
  class WithData extends React.Component {
    static displayName = `WithData(${ComposedComponent.displayName})`;

    static async getInitialProps(ctx) {
      let serverState = {};
      let userAgent;

      const cookies = process.browser ? new Cookies() : ctx.req.universalCookies;
      const headers = process.browser ? {} : ctx.req.headers;

      const apollo = initApollo(cookies);
      const redux = initRedux(apollo);

      if (process.browser) {
        userAgent = navigator.userAgent;
      } else {
        userAgent = ctx.req.headers['user-agent'];
      }

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};

      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx, cookies, apollo);
      }

      const muiTheme = getMuiTheme(
        {
          palette,
        },
        {
          userAgent,
        }
      );

      // Run all graphql queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        // Run all graphql queries
        const app = (
          // No need to use the Redux Provider
          // because Apollo sets up the store for us

          <CookiesProvider cookies={cookies}>
            <ApolloProvider client={apollo} store={redux}>
              <MuiThemeProvider muiTheme={muiTheme}>
                <ComposedComponent {...composedInitialProps} />
              </MuiThemeProvider>
            </ApolloProvider>
          </CookiesProvider>
        );

        try {
          await getDataFromTree(app);
        } catch (e) {
          // NO_OP to avoid crashing the app
        }

        // Extract query data from the store
        const state = redux.getState();

        // No need to include other initial Redux state because when it
        // initialises on the client-side it'll create it again anyway
        serverState = {
          apollo: {
            // Make sure to only include Apollo's data state
            data: state.apollo.data,
          },
        };
      }

      return {
        serverState,
        ...composedInitialProps,
        cookies,
        headers,
        userAgent,
      };
    }

    constructor(props) {
      super(props);

      this.apollo = initApollo(process.browser ? new Cookies() : new Cookies(props.cookies));
      this.redux = initRedux(this.apollo, this.props.serverState);
      this.muiTheme = getMuiTheme(
        {
          palette,
          menuItem: {
            selectedTextColor: '#74bbe7',
          },
        },
        {
          userAgent: props.userAgent,
        }
      );
    }

    cookieCase(child) {
      if (process.browser) {
        return (
          <CookiesProvider>
            {child}
          </CookiesProvider>
        );
      }

      return (
        <CookiesProvider cookies={this.props.cookies}>
          {child}
        </CookiesProvider>
      );
    }

    render() {
      return this.cookieCase(
        <ApolloProvider client={this.apollo} store={this.redux}>
          <MuiThemeProvider muiTheme={this.muiTheme}>
            <ComposedComponent {...this.props} />
          </MuiThemeProvider>
        </ApolloProvider>
      );
    }
  };
