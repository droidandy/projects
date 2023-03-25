import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Helmet from 'react-helmet';

export default class MyDocument extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);

    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it

    return { ...documentProps, helmet: Helmet.rewind() };
  }

  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  // should render on <head>
  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter(el => el !== 'htmlAttributes') // remove htmlAttributes which is not for <head> but for <html>
      .map(el => this.props.helmet[el].toComponent());
  }

  render() {
    const { helmet } = this.props;
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();

    return (
      <html {...this.helmetHtmlAttrComponents}>
        <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
            integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <link rel="stylesheet" href="/static/day-picker.css" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <link rel="stylesheet" href="/static/froala_editor.min.css" />
          <link rel="stylesheet" href="/static/froala_editor_plugins/char_counter.min.css" />
          <link rel="stylesheet" href="/static/froala_editor_plugins/image.min.css" />
          <link rel="stylesheet" href="/static/override.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js" />
          <script src="/static/zendesk.js" />
          <script src="/static/froala_editor.min.js" />
          <script src="/static/froala_editor_plugins/lists.min.js" />
          <script src="/static/froala_editor_plugins/char_counter.min.js" />
          <script src="/static/froala_editor_plugins/image.min.js" />
          {/* TODO: use helmet */}
          <meta
            name="google-signin-client_id"
            content="113676628234-g5cp8qqmec6cdcq9jikdgvac6tjqvvkv.apps.googleusercontent.com"
          />
          <script src="https://apis.google.com/js/platform.js" async defer />

          {/* TODO: remove my API key */}
          {/* TODO: use helmet */}
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAGak7gZcsxcJJww-Ui5rsDjYc2q8lEdAs&libraries=places" />
          {styleTags}
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {helmet.script.toComponent()}
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <div className="root">{main}</div>
          <NextScript />
        </body>
      </html>
    );
  }
}
