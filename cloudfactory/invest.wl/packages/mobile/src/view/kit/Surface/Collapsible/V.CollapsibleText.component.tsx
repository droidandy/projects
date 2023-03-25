import { ToggleX } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { TVThemeFont, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { LayoutAnimation, LayoutAnimationConfig, LayoutAnimationTypes, LayoutChangeEvent } from 'react-native';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VTouchable } from '../../Input/Touchable';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { VHyperlink } from '../../Output/Hyperlink';
import { VIcon } from '../../Output/Icon';

import { VText } from '../../Output/Text';

interface IVCollapsibleTextProps<C> extends IVFlexProps {
  readonly text?: string;
  readonly font: TVThemeFont;
  readonly showMoreFont?: TVThemeFont;
  readonly showMoreColor: string;
  readonly collapsedLines?: number;
  readonly isExpanded?: boolean;
  readonly collapseDuration: number;
  readonly collapseType: keyof LayoutAnimationTypes;
  readonly springDamping: number;
  readonly initialTextLength?: number;
  readonly context?: C;
  readonly isHyperlinked?: boolean;

  onChange?(isOpen: boolean, context?: C): void;
}

const COLLAPSIBLE_TEXT_HEIGHT_MIN = 65;

@observer
export class VCollapsibleText<C> extends React.Component<IVCollapsibleTextProps<C>> {
  public static defaultProps: Partial<IVCollapsibleTextProps<any>> = {
    collapseDuration: 250,
    collapseType: 'linear',
    springDamping: 0.7,
    font: 'body6',
    showMoreFont: 'body6',
    collapsedLines: 3,
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _toggler = new ToggleX(false);
  @observable private _heightFull?: number | null;

  constructor(props: IVCollapsibleTextProps<C>) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _isExpandable() {
    return this._heightFull !== null;
  }

  @computed
  private get _buttonText() {
    return this._toggler.isOpen ? 'Свернуть' : 'Показать больше';
  }

  @computed
  private get _textLines() {
    return (!this._isExpandable || this._toggler.isOpen) ? undefined : this.props.collapsedLines;
  }

  @computed
  private get _textStyle() {
    return { height: this._toggler.isOpen ? (this._heightFull as any) : undefined };
  }

  @computed
  private get _iconStyle() {
    return this._toggler.isOpen ? { transform: [{ rotateZ: '180deg' }] } : {};
  }

  @computed
  private get _layoutAnimationConfig(): LayoutAnimationConfig {
    const { collapseDuration: duration, collapseType: type, springDamping } = this.props;
    return {
      duration,
      create: { type, property: LayoutAnimation.Properties.scaleXY },
      update: { type, springDamping },
    };
  }

  public componentDidUpdate(prevProps: IVCollapsibleTextProps<C>) {
    if (this.props.isExpanded != null && this.props.isExpanded !== prevProps.isExpanded) {
      LayoutAnimation.configureNext(this._layoutAnimationConfig);
      this._toggler.toggle(this.props.isExpanded);
    }
  }

  public render() {
    const theme = this.theme.kit.Collapsible;
    const { showMoreColor, font, showMoreFont, text, collapsedLines, ...rest } = this.props;

    return (
      <VCol {...rest}>
        {this._renderHyperlinkIfNeeded}
        {this._isExpandable && (
          <VTouchable.Opacity mt={theme.sMargin?.md} onPress={this._onPress}>
            <VRow justifyContent={'space-between'} alignItems={'center'}>
              <VText style={theme.button.fText}
                color={VThemeUtil.colorPick(theme.button.cText)}>{this._buttonText}</VText>
              <VIcon name={'arrow-dropdown'} fontSize={theme.icon.sFont?.md}
                color={showMoreColor || VThemeUtil.colorPick(theme.icon.cMain)}
                style={this._iconStyle} />
            </VRow>
          </VTouchable.Opacity>
        )}
      </VCol>
    );
  }

  @computed
  private get _renderHyperlinkIfNeeded() {
    return this.props.isHyperlinked ? (<VHyperlink linkDefault>{this._renderText}</VHyperlink>) : this._renderText;
  }

  @computed
  private get _renderText() {
    const theme = this.theme.kit.Collapsible;
    const { font, text } = this.props;

    return (
      <VText style={this._textStyle} font={font} color={VThemeUtil.colorPick(theme.cTitle)}
        onLayout={this._measureText} numberOfLines={this._textLines}>
        {text}
      </VText>
    );
  }

  @action.bound
  private _measureText(event: LayoutChangeEvent) {
    if (this._isExpandable !== undefined) return;
    const height = event.nativeEvent.layout.height;
    this._heightFull = height > COLLAPSIBLE_TEXT_HEIGHT_MIN ? height : null;
  }

  private _onPress = () => {
    LayoutAnimation.configureNext(this._layoutAnimationConfig);
    this._toggler.toggle();
    this.props.onChange?.(this._toggler.isOpen, this.props.context);
  };
}
