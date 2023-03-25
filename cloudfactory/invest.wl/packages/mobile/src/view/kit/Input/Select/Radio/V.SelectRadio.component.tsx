import { observer } from 'mobx-react';
import React from 'react';

import { IVFlexProps } from '../../../Layout/Flex';
import { IVSelectDataItem, IVSelectItemRenderProps, IVSelectProps, TVSelectValue } from '../V.Select.types';
import { VSelectBase } from '../V.SelectBase.component';
import { VSelectRadioItem } from './V.SelectRadioItem.component';

interface IVSelectRadioProps<T> extends IVSelectProps<T>, IVFlexProps {
  reverse?: boolean;
}

@observer
export class VSelectRadio<V extends TVSelectValue | TVSelectValue[]> extends React.Component<IVSelectRadioProps<V>> {
  public render() {
    return <VSelectBase {...this.props} renderItem={this._renderItem} />;
  }

  private _renderItem = (item: IVSelectDataItem<V>, index: number, isSelected: boolean, itemProps: IVSelectItemRenderProps<V>) => {
    const { disabled, reverse } = this.props;
    return (
      <VSelectRadioItem key={index} text={item.name} context={item}
        disabled={disabled} hint={item.hint} reverse={reverse} isChecked={isSelected} {...itemProps} />
    );
  };
}
