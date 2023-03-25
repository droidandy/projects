import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { gtmHeadScript } from 'constants/gtmHeadScript';
import { gtmBodyScript } from 'constants/gtmBodyScript';
import { isProduction } from 'constants/isProduction';
import { ruTargetBodyScript } from 'constants/ruTargetBodyScript';
import { krakenCounterScript } from '../constants/krakenCounterScript';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="ru">
        <Head>
          <link rel="preload" href="/fonts/OpenSans-Bold.woff2" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/OpenSans-Regular.woff2" as="font" crossOrigin="" />
          <link rel="preload" href="/fonts/OpenSans-SemiBold.woff2" as="font" crossOrigin="" />
          <link rel="prefetch" href="/fonts/HelveticaNeueCyr-Bold.woff2" as="font" crossOrigin="" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="yandex-verification" content="54adabae755df215" />
          <meta name="google-site-verification" content="lO2vs_mvGSkKzKypHWsA32jbnu6pgW-vVSHFy2H_wuk" />
          <meta name="facebook-domain-verification" content="ahf34528e8zcrwq8t74vw3xxfva4qr" />
        </Head>
        <body>
          <script async dangerouslySetInnerHTML={{ __html: ruTargetBodyScript }} />
          <noscript dangerouslySetInnerHTML={{ __html: gtmBodyScript }} />
          <script dangerouslySetInnerHTML={{ __html: krakenCounterScript }} />
          <noscript>
            <img src="//counter.rambler.ru/top100.cnt?pid=7451276" alt="Топ-100" />
          </noscript>
          <Main />
          <NextScript />
          {isProduction && (
            <>
              <script async src="https://www.googletagmanager.com/gtag/js?id=DC-10978310&l=dataLayerNectarin" />
              <script type="text/javascript" dangerouslySetInnerHTML={{ __html: gtmHeadScript }} />
            </>
          )}
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
