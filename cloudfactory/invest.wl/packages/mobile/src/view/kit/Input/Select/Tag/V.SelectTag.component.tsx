import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { themeStyle, VThemeUtil } from '../../../../Theme';
import { IVFlexProps } from '../../../Layout/Flex';
import { VText } from '../../../Output/Text';
import { VTouchable } from '../../Touchable';
import { IVSelectDataItem, IVSelectItemRenderProps, IVSelectProps, TVSelectValue } from '../V.Select.types';
import { VSelectBase } from '../V.SelectBase.component';

export interface IVSelectTagProps<V> extends IVSelectProps<V>, IVFlexProps {
}

@observer
export class VSelectTag<V extends TVSelectValue> extends React.Component<IVSelectTagProps<V>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { style, ...otherProps } = this.props;
    return <VSelectBase style={[themeStyle.row, style]} {...otherProps} renderItem={this._renderItem} />;
  }

  private _renderItem = (item: IVSelectDataItem<V>, index: number, isSelected: boolean, itemProps: IVSelectItemRenderProps<V>) => {
    const theme = this.theme.kit.Select.Tag;

    return (
      <VTouchable.Opacity key={index} context={item} alignItems={'center'} justifyContent={'center'}
        width={theme.sWidth?.md} height={theme.sHeight?.md} radius={theme.sRadius?.md}
        bg={isSelected ? VThemeUtil.colorPick(theme.cBg) : 'transparent'} {...itemProps}>
        <VText style={theme.fText} color={VThemeUtil.colorPick(isSelected ? theme.cActive : theme.cInactive)}>
          {item.name}
        </VText>
      </VTouchable.Opacity>
    );
  };
}
