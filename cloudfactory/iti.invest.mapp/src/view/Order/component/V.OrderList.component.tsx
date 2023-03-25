import React from 'react';
import { observer } from 'mobx-react';
import { VOrderItemModel } from '@invest.wl/view/src/Order/model/V.OrderItem.model';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VOrderItem } from './V.OrderItem.component';
import { IVMapXList } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { IAsynXPaged } from '@invest.wl/common/src/reactive/AsynX/AsynX.types';
import { VList } from '@invest.wl/mobile/src/view/kit';

export interface IVOrderListProps {
  listX: IVMapXList<VOrderItemModel, IAsynXPaged<any>>;
  onCancel?(item: VOrderItemModel): Promise<void> | void;
  onReplace?(item: VOrderItemModel): Promise<void> | void;
  onRepeat?(item: VOrderItemModel): Promise<void> | void;
}

@observer
export class VOrderList extends React.Component<IVOrderListProps> {
  public render() {
    const { listX } = this.props;
    return (
      <FlatList data={listX.list} renderItem={this.itemRender}
        ItemSeparatorComponent={VList.Separator}
        refreshing={listX.source.isLoadingMore}
        onRefresh={listX.source.refresh}
        onEndReached={listX.source.canLoadMore ? listX.source.loadMore : undefined}
        onEndReachedThreshold={0.2}
      />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VOrderItemModel>) =>
    <VOrderItem model={data.item} onCancel={this.props.onCancel} onReplace={this.props.onReplace}
      onRepeat={this.props.onRepeat} />;
}
