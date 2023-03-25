import { IAsynX, IAsynXPaged } from '@invest.wl/common/src/reactive/AsynX/AsynX.types';
import { IVMapXList } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { VList } from '@invest.wl/mobile';
import { IVInstrumentQuoteModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentQuote.model';
import { IVInstrumentSearchModel } from '@invest.wl/view/src/Instrument/model/V.InstrumentSearch.model';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo, ViewStyle } from 'react-native';
import { VInstrumentItem } from './V.InstrumentItem.component';

type TModel = IVInstrumentQuoteModel | IVInstrumentSearchModel;
type TAsynX = IAsynXPaged<any> | IAsynX<any>;

export interface IVInstrumentListProps<M extends TModel, A extends TAsynX> {
  style?: ViewStyle;
  listX: IVMapXList<M, A>;
  onPress(model: M): void;
}

@observer
export class VInstrumentList<M extends TModel, A extends TAsynX> extends React.Component<IVInstrumentListProps<M, A>> {
  public render() {
    const { listX, style } = this.props;
    return (
      <FlatList contentContainerStyle={style} data={listX.list} renderItem={this.itemRender}
        ItemSeparatorComponent={VList.Separator}
        refreshing={(listX.source as IAsynXPaged<any>).isLoadingMore || false}
        onRefresh={listX.source.refresh}
        onEndReached={(listX.source as IAsynXPaged<any>).canLoadMore ? (listX.source as IAsynXPaged<any>).loadMore : undefined}
        onEndReachedThreshold={0.2} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<M>) =>
    <VInstrumentItem model={data.item} onPress={this.props.onPress} />;
}
