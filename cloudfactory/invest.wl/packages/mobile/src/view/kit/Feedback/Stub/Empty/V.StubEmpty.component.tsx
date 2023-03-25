import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';

import { IVFlexProps, VCol } from '../../../Layout/Flex';
import { VImage } from '../../../Output/Image';
import { VText } from '../../../Output/Text';

interface IEmptyContentStubProps extends IVFlexProps {
  title?: string;
  aboveText?: string;
  text?: string;
  image?: ImageSourcePropType;
}

@observer
export class VStubEmpty extends React.Component<IEmptyContentStubProps> {
  public static defaultProps = {
    children: 'Нет данных',
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { title, aboveText, text, image, children, ...props } = this.props;
    const theme = this.theme.kit.Stub.Empty;
    return (
      <VCol flex justifyContent={'center'} alignItems={'center'} {...props}>
        {!!image && <VImage source={image} mb={theme.image.sMargin?.md} />}
        {!!title && (
          <VText style={theme.title.fText} color={VThemeUtil.colorPick(theme.title.cText)} ta={'center'}
            mb={theme.title.sMargin?.md}>{title}</VText>
        )}
        {!!aboveText &&
        <VText style={theme.text.fText} ta={'center'} mb={theme.text.sMargin?.md}>{aboveText}</VText>}
        <VText style={theme.text.fText} ta={'center'} color={VThemeUtil.colorPick(theme.text.cText)}>{children}</VText>
      </VCol>
    );
  }
}
