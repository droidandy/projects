import { observer } from 'mobx-react';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';

/*
Скрипт внедряемый в WebView.
Отлавливает все события клика по WebView окну, если у кликнутого элемена есть
атрибут href (элемент ссылка), то проветяем что ссылка ведет на другой ресурс, и если это так,
вызываем window.ReactNativeWebView.postMessage c href (это вызовет onMessage у WebView,
и откроет ссылкув дефолтном браузере)
*/
const script = `
window.addEventListener("click", function(e) {
  const resourceHref = window.location.href;
  const linkHref = e.target && e.target.href;
  const isLinkToAnotherResource = !linkHref.startsWith(resourceHref);
  const isHasPostMessage = window.ReactNativeWebView && window.ReactNativeWebView.postMessage;
  if (isHasPostMessage && linkHref && isLinkToAnotherResource) {
    e.preventDefault();
    e.stopPropagation();
    window.ReactNativeWebView.postMessage(linkHref);
  }
});
`;

export interface IVWebViewProps extends WebViewProps {
  url: string;
  html?: string;
  externalLinkInBrowser?: boolean;
}

@observer
export class VWebView extends React.Component<IVWebViewProps> {
  public static defaultProps = {
    startInLoadingState: true,
    scrollEnabled: true,
  };

  private _ref = React.createRef<WebView>();

  public render() {
    const { externalLinkInBrowser, url, html, style, ...restProps } = this.props;
    return (
      <WebView ref={this._ref}
        source={html ? { html } : { uri: url }}
        injectedJavaScript={externalLinkInBrowser ? script : ''}
        style={[SS.webView, style]}
        {...restProps}
        onMessage={this._onMessage}
      />
    );
  }

  private _onMessage = (e: WebViewMessageEvent) => {
    const { externalLinkInBrowser, onMessage } = this.props;
    if (onMessage) {return onMessage(e);} else if (externalLinkInBrowser) {
      const url = (e as any).nativeEvent?.result;
      if (url) Linking.openURL(url).then();
    }
  };

  public goBack() {
    this._ref.current?.goBack();
  }

  public goForward() {
    this._ref.current?.goForward();
  }
}

const SS = StyleSheet.create({
  webView: { height: '100%', width: '100%' },
});
