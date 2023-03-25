import { IAsynXPaged } from '@invest.wl/common';
import { IVMapXList } from '@invest.wl/common/src/reactive/MapX/MapX.types';
import { IoC } from '@invest.wl/core';
import { VInvestIdeaItemModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdeaItem.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VInvestIdeaItem } from './V.InvestIdeaItem.component';

export interface IVInvestIdeaListProps {
  listX: IVMapXList<VInvestIdeaItemModel, IAsynXPaged<any>>;
  onPress(model: VInvestIdeaItemModel): void;
}

@observer
export class VInvestIdeaList extends React.Component<IVInvestIdeaListProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInvestIdeaListProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get indent() {
    return this.theme.space.lg;
  }

  public render() {
    const { listX } = this.props;

    return (
      <FlatList data={listX.list!} renderItem={this.itemRender}
        refreshing={listX.source.isLoadingMore}
        onRefresh={listX.source.refresh}
        onEndReached={listX.source.canLoadMore ? listX.source.loadMore : undefined}
        onEndReachedThreshold={0.2} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VInvestIdeaItemModel>) => {
    const isLast = data.index === (this.props.listX.list!.length - 1);
    return (
      <VInvestIdeaItem mt={this.indent}
        mb={isLast ? this.indent : 0} mh={this.indent}
        model={data.item} onPress={this.props.onPress} />
    );
  };
}
