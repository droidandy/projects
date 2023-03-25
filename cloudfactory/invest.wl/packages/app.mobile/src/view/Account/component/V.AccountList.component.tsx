import { VAccountModel } from '@invest.wl/view/src/Account/model/V.Account.model';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VAccountItem } from './V.AccountItem.component';

export interface IVAccountListProps {
  list: VAccountModel[];
}

@observer
export class VAccountList extends React.Component<IVAccountListProps> {
  public render() {
    const { list } = this.props;

    return (
      <FlatList data={list} renderItem={this.itemRender} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VAccountModel>) => <VAccountItem model={data.item} />;
}
