import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { TextStyle } from 'react-native';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol, VRow } from '../../Layout/Flex';
import { VIcon } from '../../Output/Icon';
import { VText } from '../../Output/Text';
import { VTouchable } from '../Touchable';

interface IVInputFakeProps<C = any> extends IVFlexProps {
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  context?: C;
  textStyle?: TextStyle;
  withoutBorder?: boolean;
  onPress?(context?: C): void;
}

@observer
export class VInputFake<C = any> extends React.Component<IVInputFakeProps<C>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInputFakeProps<C>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.InputField;
    const { value, placeholder, onPress, context, disabled, bg, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!!value && !!placeholder && (
          <VText style={theme.input.fText} color={VThemeUtil.colorPick(theme.input.cText)}>{placeholder}</VText>
        )}
        {!!onPress && (
          <VTouchable.Opacity onPress={onPress} context={context} disabled={disabled} opacity={1}>
            {this._contentRender}
          </VTouchable.Opacity>
        )}
        {!onPress && this._contentRender}
      </VCol>
    );
  }

  @computed
  private get _contentRender() {
    const theme = this.theme.kit.InputField;
    const { value, placeholder, bg, textStyle, withoutBorder, disabled } = this.props;

    return (
      <VRow minHeight={theme.sHeight?.md} alignItems={'center'} justifyContent={'space-between'}
        ph={withoutBorder ? undefined : theme.sPadding?.md}
        borderWidth={withoutBorder ? undefined : theme.sBorder?.md}
        borderColor={withoutBorder ? undefined : VThemeUtil.colorPick(theme.cBorder)}
        bg={withoutBorder ? undefined : disabled ? VThemeUtil.colorPick(theme.cDisabled) : bg || VThemeUtil.colorPick(theme.input.cBg)}
        radius={withoutBorder ? undefined : theme.sRadius?.md}>
        <VText flex mr={this.theme.space.lg} style={[theme.input.fText, textStyle]} numberOfLines={1}
          color={VThemeUtil.colorPick(value != null ? theme.input.cText : theme.placeholder.cText)}
        >{value || placeholder}</VText>
        <VIcon name={'arrow-dropdown'} fontSize={theme.backspace.sFont?.md}
          color={VThemeUtil.colorPick(theme.backspace.cMain)} />
      </VRow>
    );
  }
}
