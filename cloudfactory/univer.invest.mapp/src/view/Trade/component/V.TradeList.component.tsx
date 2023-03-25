import React from 'react';
import { observer } from 'mobx-react';
import { VTradeModel } from '@invest.wl/view/src/Trade/model/V.Trade.model';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VTradeItem } from './V.TradeItem.component';
import { IVMapXList } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { IAsynXPaged } from '@invest.wl/common/src/reactive/AsynX/AsynX.types';
import { VList } from '@invest.wl/mobile/src/view/kit';

export interface IVTradeListProps {
  listX: IVMapXList<VTradeModel, IAsynXPaged<any>>;
}

@observer
export class VTradeList extends React.Component<IVTradeListProps> {
  public render() {
    const { listX } = this.props;
    return (
      <FlatList data={listX.list} renderItem={this.itemRender}
        ItemSeparatorComponent={VList.Separator}
        refreshing={listX.source.isLoadingMore}
        onRefresh={listX.source.refresh}
        onEndReached={listX.source.canLoadMore ? listX.source.loadMore : undefined}
        onEndReachedThreshold={0.2} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VTradeModel>) =>
    <VTradeItem model={data.item} />;
}
