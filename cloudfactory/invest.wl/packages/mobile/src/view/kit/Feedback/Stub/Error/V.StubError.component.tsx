import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VCol } from '../../../Layout/Flex';
import { VText } from '../../../Output/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string;
  text?: string | string[];
}

@observer
export class VStubError extends React.Component<Props> {
  private static errorText = 'В настоящее время данные\n' +
    'недоступны. Попробуйте позднее.';

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const props = this.props;
    const theme = this.theme.kit.Stub.Error;
    const text = props.title || props.text || VStubError.errorText;

    return (
      <VCol flex pa={theme.sPadding?.md} justifyContent={'center'} alignItems={'center'} style={props.style}>
        <VText style={theme.fText} color={VThemeUtil.colorPick(theme.cText)} ta={'center'}>{text}</VText>
      </VCol>
    );
  }
}
