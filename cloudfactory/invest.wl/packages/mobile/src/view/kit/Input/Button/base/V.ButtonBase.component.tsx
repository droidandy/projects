import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils/Compound.component';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VCol, VRow } from '../../../Layout/Flex';
import { VIcon } from '../../../Output/Icon/V.Icon.component';
import { VText } from '../../../Output/Text/V.Text.component';
import { VTouchable } from '../../Touchable';
import { VButtonModel } from '../V.Button.model';
import { EVButtonState, IVButtonColor, IVButtonProps } from '../V.Button.types';
import { VButtonProcessing } from './V.ButtonProcessing.component';

type IProps<C = any> = Omit<IVButtonProps<C>, 'size' | 'colorMap'>
& Required<Pick<IVButtonProps<C>, 'size' | 'coloring'>>;

@observer
export class VButtonBase<C = any> extends React.Component<IProps<C>> {
  public static defaultProps: Partial<IProps> = {
    size: 'md',
    coloring: { bg: true, border: true },
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  public model = new VButtonModel(() => this.props);

  constructor(props: IProps<C>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.Button;
    const {
      children, size, processing, disabled, pressable, color, context, onPress, circle, ...flexProps
    } = this.props;

    return (
      <VTouchable.Opacity height={theme.sHeight?.[size]} width={theme.sWidth?.md} radius={theme.sRadius?.md}
        borderWidth={theme.sBorder?.md} borderColor={this._color.border} bg={this._color.bg}
        justifyContent={'center'} alignItems={'center'} {...this.model.touchableProps} {...flexProps}>
        <VButtonProcessing processing={this.model.isProcessing} color={this._color.text} peers={children}>
          {this._contentRender}
        </VButtonProcessing>
      </VTouchable.Opacity>
    );
  }

  @computed
  private get _contentRender() {
    const theme = this.theme.kit.Button;
    const { children, size } = this.props;
    if (typeof children === 'string') {
      return (
        <VText style={theme.fText} color={this._color.text}>{children}</VText>
      );
    }

    return (
      <>
        <CompoundUtils.Find peers={children} byPeerType={VIcon}>{e => !!e && (
          <VIcon color={this._color.text} fontSize={theme.icon.sFont?.[size]}
            {...e.props} />
        )}</CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VText}>{e => !!e && (
          <VText style={theme.fText} color={this._color.text} {...e.props}>{e.props.children}</VText>
        )}</CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VCol}>{e => !!e && (
          <VCol {...e.props} />
        )}</CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VRow}>{e => !!e && (
          <VRow {...e.props} />
        )}</CompoundUtils.Find>
      </>
    );
  }

  @computed
  private get _color(): IVButtonColor {
    const theme = this.theme.kit.Button;
    const { color, colorText, coloring } = this.props;
    const cMain = color || VThemeUtil.colorPick(theme.cMain);
    const cText = colorText || VThemeUtil.colorPick(theme.cText);
    const cDisabled = VThemeUtil.colorPick(theme.cDisabled);

    switch (this.model.state) {
      case EVButtonState.Normal:
        return {
          border: coloring.border ? cMain : 'transparent',
          bg: coloring.bg ? cMain : 'transparent',
          text: coloring.text ? cMain : cText,
        };
      case EVButtonState.Press:
      case EVButtonState.Processing:
        return {
          border: coloring.border ? cMain : 'transparent',
          bg: coloring.bg ? cMain : 'transparent',
          text: coloring.text ? cMain : cText,
        };
      case EVButtonState.Disabled:
        return {
          border: coloring.border ? cDisabled : 'transparent',
          bg: coloring.bg ? cDisabled : 'transparent',
          text: coloring.text ? cDisabled : cText,
        };
    }
  }
}
