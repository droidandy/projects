import React from 'react';
import { observer } from 'mobx-react';
import { VNewsModel } from '@invest.wl/view/src/News/model/V.News.model';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VNewsItem } from './V.NewsItem.component';

export interface IVNewsListProps {
  list: VNewsModel[];
}

@observer
export class VNewsList extends React.Component<IVNewsListProps> {
  public render() {
    const { list } = this.props;

    return (
      <FlatList data={list} renderItem={this.itemRender} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VNewsModel>) => <VNewsItem model={data.item} />;
}
