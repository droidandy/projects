import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Linking, StyleProp, TextStyle } from 'react-native';
import openEmail from 'react-native-email';
import RNHyperlink from 'react-native-hyperlink';
import openCall from 'react-native-phone-call';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

export interface IVHyperlinkProps {
  markdown?: boolean;
  onLinkError?: (url: string, text: string, error: Error) => void;

  // HyperlinkProps
  linkDefault?: boolean;
  linkify?: object;
  linkStyle?: StyleProp<TextStyle>;
  linkText?: string | ((text: string) => string);
  onPress?: (url: string, text: string) => void;
  onLongPress?: (url: string, text: string) => void;
}

const markdownLinkReg = /\[([^\[\]]+)\]\(([^)]+)\)/img;
const PhoneSchema = 'tel:';
const EmailSchema = 'mailto:';

interface LinkMap {
  [linkKey: string]: { url: string; title: string };
}

/**
 * В режиме markdown распознаёт ссылки в формате [<текст>](ссылка),
 * умеет обрабатывать схемы tel: и mailto:
 * Однако появляется ограничение на использование единственного <Text> внутри только со строкой в нём.
 * Идея работы такая:
 * - вытащить весь текст из children
 * - регуляркой markdownLinkReg заменить все markdown ссылки на фиктивные http://N ссылки
 * - при этом сложить url и title в словарик linkMap[linkKey]: {url, title}
 * - linkText и onPress будут лазить в словарик linkMap за заголовком и реальным url ссылки
 */
@observer
export class VHyperlink extends React.Component<IVHyperlinkProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    if (this.props.markdown) return this.renderMarkdown();
    return this.renderDefault();
  }

  public renderDefault() {
    const theme = this.theme.kit.Hyperlink;
    return (
      <RNHyperlink linkDefault={this.props.linkDefault} linkStyle={{ color: VThemeUtil.colorPick(theme.cMain) }}
        linkText={this._linkText} {...this.props} />
    );
  }

  public renderMarkdown() {
    const theme = this.theme.kit.Hyperlink;
    const { children, markdown, linkDefault, linkText, onPress, onLongPress, ...props } = this.props;
    let aLinkText = linkText || this._linkText;
    let onPressHandler = this.handleLinkDefault;
    let onLongPressHandler = onLongPress;

    const childs = React.Children.toArray(children);
    if (childs.length > 1) {
      throw new Error('Hyperlink with markdown: true supports only single children Text with only string inside');
    }

    let maybeChildren = childs[0];
    if (maybeChildren) {
      const rawText = this._getChildrenText(this);
      const { text, linkMap } = this._processLinkMap(rawText);
      maybeChildren = React.cloneElement(maybeChildren as any, { children: text });

      aLinkText = (link: string): string => linkMap[link] ? linkMap[link].title : link;

      onPressHandler = async (link: string, _: string) => {
        let url = link;
        let title = '';

        if (linkMap[link]) {
          url = linkMap[link].url;
          title = linkMap[link].title;
        }

        if (onPress) {
          onPress(url, title);
        } else if (linkDefault) {
          await this.handleLinkDefault(url, title);
        }
      };

      onLongPressHandler = async (link: string, _: string) => {
        if (onLongPress) {
          let url = link;
          let title = '';

          if (linkMap[link]) {
            url = linkMap[link].url;
            title = linkMap[link].title;
          }

          onLongPress(url, title);
        }
      };
    }

    return (
      <RNHyperlink
        linkDefault={false}
        linkStyle={{ color: VThemeUtil.colorPick(theme.cMain) }}
        linkText={aLinkText}
        onPress={onPressHandler}
        onLongPress={onLongPressHandler}
        {...props}>{maybeChildren}</RNHyperlink>
    );
  }

  private handleLinkDefault = async (url: string, text: string) => {
    const [schema, value] = url.split('//');

    try {
      if (schema && value && schema.toLowerCase() === PhoneSchema) {
        await openCall({ number: value, prompt: true });
      } else if (schema && value && schema.toLowerCase() === EmailSchema) {
        await openEmail(value);
      } else {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      if (this.props.onLinkError) {
        this.props.onLinkError(url, text, error);
      }
    }
  };

  private _linkText = (url: string): string => url.replace('https://', '');

  private _getChildrenText(element: React.Component | React.PureComponent | React.ReactElement, text?: string): string {
    const props = element.props;
    text = text || '';

    React.Children.forEach(props.children, child => {
      if (typeof child === 'string') {
        text += child;
      } else if (typeof child === 'number') {
        text += child.toString();
      } else if (React.isValidElement(child)) {
        text = this._getChildrenText(child, text);
      }
    });

    return text;
  }

  private _processLinkMap(text: string): { text: string; linkMap: LinkMap } {
    const linkMap: LinkMap = {};
    let counter = 0;
    text = text.replace(markdownLinkReg, (substring, ...args) => {
      const title = args[0];
      const url = args[1];
      const linkKey = `http://${counter++}`;
      linkMap[linkKey] = { url, title };

      return linkKey;
    });

    return { text, linkMap };
  }
}
