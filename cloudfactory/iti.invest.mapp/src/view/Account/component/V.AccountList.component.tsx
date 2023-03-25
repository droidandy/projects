import React from 'react';
import { observer } from 'mobx-react';
import { VAccountModel } from '@invest.wl/view/src/Account/model/V.Account.model';
import { VAccountItem } from './V.AccountItem.component';
import { FlatList, ListRenderItemInfo } from 'react-native';

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
