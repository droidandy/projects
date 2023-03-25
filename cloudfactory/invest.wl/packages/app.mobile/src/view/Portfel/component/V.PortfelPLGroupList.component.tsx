import { EDPortfelGroup, IoC } from '@invest.wl/core';
import { IVFlexProps, VCard, VCol } from '@invest.wl/mobile';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VPortfelPLGroupByAccountItem } from './V.PortfelPLGroupByAccountItem.component';
import { VPortfelPLGroupByInstrumentTypeItem } from './V.PortfelPLGroupByInstrumentTypeItem.component';

export interface IVPortfelPLGroupListProps extends IVFlexProps {
  list: VPortfelPLGroupModel[];
}

@observer
export class VPortfelPLGroupList extends React.Component<IVPortfelPLGroupListProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { list, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        <FlatList data={list} renderItem={this.itemRender} />
      </VCol>
    );
  }

  private itemRender = (data: ListRenderItemInfo<VPortfelPLGroupModel>) => {
    const { space } = this.theme;
    let item: React.ReactNode;
    if ([EDPortfelGroup.AccountId, EDPortfelGroup.AccountMarketType].includes(data.item.domain.groupX.by)) {
      item = <VPortfelPLGroupByAccountItem model={data.item} />;
    } else if (data.item.domain.groupX.by === EDPortfelGroup.InstrumentAssetType) {
      item = <VPortfelPLGroupByInstrumentTypeItem model={data.item} />;
    }
    const isLast = data.index === (this.props.list.length - 1);
    return (
      <VCard mt={space.md} mb={isLast ? space.lg / 2 : 0}
        mh={space.lg} pa={space.lg}>{item}</VCard>
    );
  };
}
