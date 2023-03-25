import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { themeStyle, VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IFlexProps } from '../../../Layout/Flex/V.Flex.util';
import { VText } from '../../../Output/Text';
import { VTouchableOpacity } from '../../Touchable';
import { IVSelectDataItem, IVSelectItemRenderProps, IVSelectProps, TVSelectValue } from '../V.Select.types';
import { VSelectBase } from '../V.SelectBase.component';

export interface IVSelectButtonProps<V> extends IVSelectProps<V>, IFlexProps {
}

@observer
export class VSelectButton<V extends TVSelectValue | TVSelectValue[]> extends React.Component<IVSelectButtonProps<V>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVSelectButtonProps<V>) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _isSpaced() {
    return !!this.theme.kit.Select.Button.item.sMargin?.md;
  }

  public render() {
    const { style, ...otherProps } = this.props;
    const theme = this.theme.kit.Select.Button;

    return (
      <VSelectBase style={[themeStyle.row, style]} minHeight={theme.sHeight?.md}
        radius={!this._isSpaced ? theme.sRadius?.md : 0} overflow={!this._isSpaced ? 'hidden' : undefined}
        {...otherProps} renderItem={this._renderItem} />
    );
  }

  private _renderItem = (item: IVSelectDataItem<V>, index: number, isSelected: boolean, itemProps: IVSelectItemRenderProps<V>) => {
    const { data, disabled } = this.props;
    const theme = this.theme.kit.Select.Button;

    return (
      <VTouchableOpacity key={index} context={item} disabled={disabled}
        activeOpacity={isSelected ? 1 : 0.6} justifyContent={'center'} alignItems={'center'}
        ph={theme.item.sPadding?.md} ml={!!index ? theme.item.sMargin?.md : 0}
        width={!this._isSpaced ? (100 / data.length) + '%' : undefined}
        radius={this._isSpaced ? theme.item.sRadius?.md : 0} index={index}
        bg={VThemeUtil.colorPick(isSelected ? theme.item.cActive : theme.item.cInactive)} {...itemProps}>
        <VText style={theme.text.fText} ta={'center'}
          color={VThemeUtil.colorPick(isSelected ? theme.text.cActive : theme.text.cInactive)}>{item.name}</VText>
      </VTouchableOpacity>
    );
  };
}
