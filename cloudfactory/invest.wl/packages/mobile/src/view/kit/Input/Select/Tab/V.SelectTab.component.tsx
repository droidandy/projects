import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { themeStyle, VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IFlexProps } from '../../../Layout/Flex/V.Flex.util';
import { VText } from '../../../Output/Text';
import { VTouchableOpacity } from '../../Touchable';
import { IVSelectDataItem, IVSelectItemRenderProps, IVSelectProps, TVSelectValue } from '../V.Select.types';
import { VSelectBase } from '../V.SelectBase.component';

export interface IVSelectTabProps<V> extends IVSelectProps<V>, IFlexProps {
}

@observer
export class VSelectTab<V extends TVSelectValue | TVSelectValue[]> extends React.Component<IVSelectTabProps<V>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { style, ...otherProps } = this.props;
    return <VSelectBase style={[themeStyle.row, style]} {...otherProps} renderItem={this._renderItem} />;
  }

  private _renderItem = (item: IVSelectDataItem<V>, index: number, isSelected: boolean, itemProps: IVSelectItemRenderProps<V>) => {
    const { data, disabled } = this.props;
    const theme = this.theme.kit.Select.Tab;

    return (
      <VTouchableOpacity key={index} disabled={disabled} activeOpacity={isSelected ? 1 : 0.6}
        pa={theme.sPadding?.md} width={(100 / data.length) + '%'} borderBottomWidth={theme.sBorder?.md}
        borderColor={VThemeUtil.colorPick(isSelected ? theme.line.cActive : theme.line.cInactive)}
        context={item} {...itemProps}>
        <VText style={theme.text.fText} ta={'center'}
          color={VThemeUtil.colorPick(isSelected ? theme.text.cActive : theme.text.cInactive)}>{item.name}</VText>
      </VTouchableOpacity>
    );
  };
}
