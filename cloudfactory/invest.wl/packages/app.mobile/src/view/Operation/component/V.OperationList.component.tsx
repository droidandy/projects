import { VOperationModel } from '@invest.wl/view/src/Operation/model/V.Operation.model';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VOperationItem } from './V.OperationItem.component';

export interface IVOperationListProps {
  list: VOperationModel[];
}

@observer
export class VOperationList extends React.Component<IVOperationListProps> {
  public render() {
    const { list } = this.props;

    return (
      <FlatList data={list} renderItem={this.itemRender} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VOperationModel>) => <VOperationItem model={data.item} />;
}
