import React from 'react';
import { observer } from 'mobx-react';
import { IVInstrumentAlertModel } from '@invest.wl/view/src/InstrumentAlert/model/V.InstrumentAlert.model';
import { FlatList, FlatListProps, ListRenderItemInfo } from 'react-native';
import { VInstrumentAlertItem } from './V.InstrumentAlertItem.component';
import { IVMapXList } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { IAsynXPaged } from '@invest.wl/common/src/reactive/AsynX/AsynX.types';
import { VList } from '@invest.wl/mobile/src/view/kit';

export interface IVInstrumentAlertListProps<T extends IVInstrumentAlertModel> extends Partial<FlatListProps<T>> {
  listX: IVMapXList<T, IAsynXPaged<any>>;
  onCancel?(item: T): Promise<any> | void;
}

@observer
export class VInstrumentAlertList<T extends IVInstrumentAlertModel> extends React.Component<IVInstrumentAlertListProps<T>> {
  public render() {
    const { listX, onCancel, ...flatListProps } = this.props;
    return (
      <FlatList data={listX.list} renderItem={this.itemRender}
        ItemSeparatorComponent={VList.Separator}
        refreshing={listX.source.isLoadingMore}
        onRefresh={listX.source.refresh}
        onEndReached={listX.source.canLoadMore ? listX.source.loadMore : undefined}
        onEndReachedThreshold={0.2} {...flatListProps}
      />
    );
  }

  private itemRender = (data: ListRenderItemInfo<IVInstrumentAlertModel>) =>
    <VInstrumentAlertItem model={data.item} onCancel={this.props.onCancel} />;
}
