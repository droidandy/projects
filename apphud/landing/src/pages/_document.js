import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    const key = "GTM-58QHBBJ";

    return (
      <Html>
        <Head>
          <>
            <link
              rel="apple-touch-icon"
              sizes="76x76"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="yandex-verification" content="5ea5995062dc6700" />
            <meta
              content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
              name="viewport"
            />
            <meta name="apple-mobile-web-app-title" content="Apphud" />
            <meta name="application-name" content="Apphud" />
            <meta name="format-detection" content="telephone=no" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Apphud" />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:site" content="Apphud" />
            <meta name="twitter:domain" content="apphud.com" />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.intercomSettings = {
                app_id: "xo2ecsjj"
              };`,
              }}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/xo2ecsjj';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
              }}
            />
          </>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
