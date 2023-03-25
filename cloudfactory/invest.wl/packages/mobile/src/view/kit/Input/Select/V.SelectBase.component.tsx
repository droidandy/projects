import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VFlex } from '../../Layout';
import { IFlexProps } from '../../Layout/Flex/V.Flex.util';
import { IVSelectData, IVSelectDataItem, IVSelectItemRenderProps, IVSelectProps, TVSelectValue } from './V.Select.types';
import { VSelectBodyScrollable } from './V.SelectBodyScrollable.component';

export interface IVSelectBaseProps<V> extends IVSelectProps<V>, IFlexProps {
  renderItem(item: IVSelectDataItem<V>, index: number, isSelected: boolean, props: IVSelectItemRenderProps): void;
}

@observer
export class VSelectBase<V extends TVSelectValue | TVSelectValue[]> extends React.Component<IVSelectBaseProps<V>> {
  constructor(props: IVSelectBaseProps<V>) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get data(): IVSelectData<V> {
    const { data, nullable } = this.props;
    return nullable ? [{ name: nullable, value: undefined }, ...data] : data;
  }

  @computed
  public get activeIndex() {
    return this.data.map(d => d.value).indexOf(this.props.selected);
  }

  public render() {
    const { style, data, selected, onChange, renderItem, scrollable, ...props } = this.props;

    if (scrollable) {
      return (
        <VSelectBodyScrollable style={style} listLength={this.data.length}
          activeIndex={this.activeIndex} {...props}>
          {this.data.map(this._renderItem)}
        </VSelectBodyScrollable>
      );
    }

    return (
      <VFlex style={style} justifyContent={'space-between'} {...props}>
        {this.data.map(this._renderItem)}
      </VFlex>
    );
  }

  private _renderItem = (item: IVSelectDataItem<V>, index: number) => {
    const { renderItem, selected } = this.props;
    return renderItem(item, index, isEqual(selected, item.value), {
      onPress: this._onPress,
    });
  };

  @action.bound
  private _onPress(selected?: IVSelectDataItem<V>) {
    if (!selected || selected.value === this.props.selected) return;
    this.props.onChange(selected.value);
  }
}
