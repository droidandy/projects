import React from 'react';
import { observer } from 'mobx-react';
import { VStoryModel } from '@invest.wl/view/src/Story/model/V.Story.model';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VStoryItem } from './V.StoryItem.component';

export interface IVStoryListProps {
  list: VStoryModel[];
}

@observer
export class VStoryList extends React.Component<IVStoryListProps> {
  public render() {
    const { list } = this.props;

    return (
      <FlatList data={list} renderItem={this.itemRender} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VStoryModel>) => <VStoryItem model={data.item} />;
}
