import React, { memo, FC, useEffect, useState } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import { generate } from 'shortid';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CookiesProvider, useCookies } from 'react-cookie';
import { NextComponentType, NextPageContext } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import 'swiper/swiper-bundle.min.css';
import { OmniLinkContext } from '@marketplace/ui-kit/components/OmniLink';
import { getSsrStore } from 'store/ssr';
import { automaticLogout } from 'store/user/actions';
import { addFlashMessage } from 'store/flash-messages';
import { theme } from 'theme';
import { PagePropsBase } from 'types/PagePropsBase';
import { Link } from 'components/Link';
import { useSsrMatchMedia } from 'hooks/useSsrMatchMedia';
import { GTMPageView, GTMPageViewWithId, rtrgOtherPageView } from 'helpers/getPageView';
import { LEAD_SOURCE_COOKIE } from 'helpers/analytics/constants';
import { PageContext, pageContextDefault } from 'helpers/context/PageContext';
import { AuthenticationContainer } from 'containers/Authentication';
import Notifications from 'containers/Notifications';
import { isProduction } from 'constants/isProduction';
import { SchemaName, STRUCTURED_DATA_MAP } from 'constants/structuredData';
import { CITY_COOKIE } from 'helpers/cookies/city';
import { checkAndSetCurrentCity } from 'helpers/checkAndSetCurrentCity';
import { initNectarinGoogleTag } from 'helpers/analytics/nectarin';
import { initRuTargetAnalytics } from '../helpers/analytics/ruTarget';
import { initHybridAnalytics } from '../helpers/analytics/hybridAnalytics';

const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
};

const UtmHandler = memo(() => {
  const [, setCookie] = useCookies([LEAD_SOURCE_COOKIE, CITY_COOKIE]);
  const router = useRouter();
  useEffect(() => {
    const searchParams = router.asPath.split('?')[1];
    if (searchParams && searchParams) {
      const parsedSearchParams = queryString.parse(searchParams);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } = parsedSearchParams;

      if (utm_source) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        setCookie(
          LEAD_SOURCE_COOKIE,
          JSON.stringify({
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            exp_time: Math.round(expirationDate.getTime() / 1000),
          }),
          {
            expires: expirationDate,
            path: '/',
          },
        );
      }
    }
  }, [setCookie, router.asPath, router.query]);
  return null;
});

const MyApp: FC<{
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any & PagePropsBase;
}> = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component,
  pageProps: { initialState, context: pageContext, ...restProps },
}) => {
  const store = getSsrStore(initialState);
  const { dispatch } = store;
  const context = pageContext || pageContextDefault;
  const { isMobileDevice } = context;
  const ssrMatchMedia = useSsrMatchMedia(isMobileDevice);
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  useEffect(() => {
    if (typeof window === 'object') {
      /* TODO - реализовать провайдер на апи,
    - вынести в него расширение конфига API (ignoreFlashMessage),
    - туда-же внести расширениие обработки ответа
    */
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (store.getState().user.isAuthorized && error.response && error.response.status === 401) {
            await dispatch(automaticLogout());
            return Promise.reject(error);
          }

          // flash error
          if (!axios.isCancel(error) && !error.config?.ignoreFlashMessage) {
            const uid = generate();
            let message = '';
            if (error.config && error.config.errorMessage) {
              const errorMessage = error.config.errorMessage;
              message = typeof errorMessage === 'function' ? errorMessage(error) : errorMessage;
            } else if (error.response && error.response.data) {
              if (error.response.status === 422) {
                const messageArray = Object.values(error.response.data as object).map((obj: object) =>
                  Object.values(obj).join(' '),
                );
                message = messageArray.join(' ');
              } else {
                message = error.response.data.message;
              }
            }

            if (message) {
              dispatch(addFlashMessage({ message, success: false, id: uid }));
            }
          }
          return Promise.reject(error);
        },
      );

      initNectarinGoogleTag();
      initRuTargetAnalytics();
      initHybridAnalytics();
      const {
        location: { pathname },
      } = window;
      rtrgOtherPageView(pathname);
      GTMPageView(pathname);
      if (store.getState().city.current.id === null) {
        checkAndSetCurrentCity(store, dispatch);
      }
    }
  }, []);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
    // pageview for GTM
    const handleRouteChange = (url: string) => {
      GTMPageViewWithId(url, store.getState()?.user.uuid);
      rtrgOtherPageView(url);
    };
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>#банкавто</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        {STRUCTURED_DATA_MAP[SchemaName.ORGANIZATION] ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __html: STRUCTURED_DATA_MAP[SchemaName.ORGANIZATION]?.jsonLD,
            }}
          />
        ) : null}
        <meta name="msapplication-TileColor" content="#990031" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <UtmHandler />
      <CookiesProvider>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <Provider store={store}>
            <PageContext.Provider value={context}>
              <ThemeProvider theme={{ ...theme, props: { MuiUseMediaQuery: { ssrMatchMedia } } }}>
                <CssBaseline />
                <AuthenticationContainer />
                <OmniLinkContext.Provider value={{ InnerLink: Link }}>
                  <Notifications />
                  <Component {...restProps} />
                </OmniLinkContext.Provider>
              </ThemeProvider>
            </PageContext.Provider>
          </Provider>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </CookiesProvider>
      {isProduction && <script src="/widgets/config.js"></script>}
      {isProduction && <script src="/widgets/widgets.min.js"></script>}
      {isProduction && (
        <link id="genesys-widgets-styles" href="/widgets/widgets.min.css" type="text/css" rel="stylesheet" />
      )}
      {isProduction && <link id="genesys-widgets-styles" href="/chat-theme.css" type="text/css" rel="stylesheet" />}
    </>
  );
};

export default memo(MyApp);
