import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Linking, Platform, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import { VCol } from '../../Layout';

const IS_IOS = Platform.OS === 'ios';

const script = `;(function() {
var wrapper = document.createElement("div");
wrapper.id = "height-wrapper";
while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
}
document.body.appendChild(wrapper);
var i = 0;
function click(e) {
  e.preventDefault();
  window.postMessage(click, '*');
};
function updateHeight() {
    document.title = wrapper.scrollHeight;
    window.location.hash = ++i;
}
function linkProcessed() {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function (e) {
            e.preventDefault();
            window.postMessage(e.currentTarget.getAttribute("href"), '*');
        }
    }

    var links = document.getElementsByTagName('img');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function (e) {
            e.preventDefault();
            window.postMessage(e.currentTarget.getAttribute("src"), '*');
        }
    }
}
updateHeight();
setTimeout(linkProcessed, 1000);
window.addEventListener("load", function() {
    updateHeight();
    setTimeout(updateHeight, 1000);
});
window.addEventListener("resize", updateHeight);
}());
`;

const postMessage = `(function() {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
})();`;

const style = `
<style>
body, html, #height-wrapper {
    font-family: 'SFProText-Regular',
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0;
    margin: 0;
    padding: 20px 0 0;
}
#height-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
li {
  padding-top: 10px;
}
</style>
`;

const textStyleToCss = (textStyle: StyleProp<TextStyle>, styles?: StyleProp<ViewStyle>): string => {
  if (!textStyle) return '';
  const { fontSize, fontFamily, fontUrl, lineHeight, letterSpacing, color } = StyleSheet.flatten(textStyle) as any;
  const { backgroundColor } = StyleSheet.flatten(styles);

  const fontUnit = IS_IOS ? 'pt' : 'px';

  return `<style type='text/css'>
${IS_IOS ? `
  @font-face {
    font-family: MyFont; font-style: normal; font-weight: 400;
    src: local('${fontFamily}'), local('${fontFamily}'), url('${fontUrl}')
  }` : `
  @font-face {font-family: MyFont; font-style: normal; font-weight: 400; src: url("${fontUrl}");}
`}
body,* {
  font-family: MyFont; font-size: ${fontSize + fontUnit}; text-align: left; 
  line-height: ${lineHeight + fontUnit}; letter-spacing: ${letterSpacing + fontUnit}; color: ${color};
  background-color: ${backgroundColor as string};
}
img{height: auto;max-width: 100%;}
iframe {height: auto;max-width: 100%;}
div{height: auto;max-width: 100%;}
</style>`;
};

const codeInject = (props: IVWebViewAutoHeightProps): string => `
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
    ${textStyleToCss(props.textStyle, props.style)}
</head>
<body>
${style}
${'<div style="color: ' + props.textStyle?.valueOf + '">' + props.html + '</div>'}
<script>
${script}
</script>
</body>
</html>`;

interface TextStyleProp extends TextStyle {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  fontUrl: string;
}

interface IVWebViewAutoHeightProps {
  html: string;
  navigateToWebview?: (url: string) => void;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyleProp>;
}

// interface State {
//   correctHtml: string;
//   height: number;
// }

@observer
export class VWebViewAutoHeight extends React.Component<IVWebViewAutoHeightProps> {
  private _ref = React.createRef<WebView>();
  @observable private _height = 120;

  @computed
  private get _html() {
    return codeInject(this.props);
  }

  constructor(props: IVWebViewAutoHeightProps) {
    super(props);
    makeObservable(this);
  }


  public componentWillUnmount(): void {
    this._ref.current?.stopLoading();
  }

  public render() {
    if (!(this.props.html && this.props.html.length > 0)) {
      return <VCol />;
    } else {
      return (
        <VCol flex overflow={'hidden'} style={this.props.style}>
          <WebView
            ref={this._ref}
            automaticallyAdjustContentInsets={true}
            source={{ html: this._html, baseUrl: '' }}
            onMessage={this.onMessage}
            javaScriptEnabled={true}
            injectedJavaScript={`${postMessage};document.body.scrollHeight;`}
            style={{ height: this._height }}
            onNavigationStateChange={this.onNavigationChange}
            domStorageEnabled={true}
            scalesPageToFit={Platform.select({ ios: undefined, android: true })}
            startInLoadingState={true}
            scrollEnabled={false}
            bounces={false}
            originWhitelist={['*']}
          />
        </VCol>
      );
    }
  }

  @action
  private onNavigationChange = (event: WebViewNavigation): void => {
    if (event.title) {
      const htmlHeight = Number(event.title); // convert to number
      if (htmlHeight && this._height !== htmlHeight) {
        this._height = htmlHeight;
      }
    }
  };

  private onMessage = (event: WebViewMessageEvent): void => {
    const url = event.nativeEvent.data;
    if (this.props.navigateToWebview) {
      this.props.navigateToWebview(url);
    } else {
      Linking.openURL(url).then();
    }
  };
}
