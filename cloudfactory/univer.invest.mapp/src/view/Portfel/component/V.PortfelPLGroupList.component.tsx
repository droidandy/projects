import React from 'react';
import { observer } from 'mobx-react';
import { VPortfelPLGroupByAccountItem } from './V.PortfelPLGroupByAccountItem.component';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel';
import { VPortfelPLGroupByInstrumentTypeItem } from './V.PortfelPLGroupByInstrumentTypeItem.component';
import { IVFlexProps, VCard, VCol } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';

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
    const { space, color } = this.theme;
    let item: React.ReactNode;
    if ([EDPortfelGroup.AccountId, EDPortfelGroup.AccountMarketType].includes(data.item.domain.groupX.by)) {
      item = <VPortfelPLGroupByAccountItem model={data.item} />;
    } else if (data.item.domain.groupX.by === EDPortfelGroup.InstrumentAssetType) {
      item = <VPortfelPLGroupByInstrumentTypeItem model={data.item} />;
    }
    const isLast = data.index === (this.props.list.length - 1);
    return (
      <VCard mt={space.md} mb={isLast ? space.lg / 2 : 0}
        mh={space.lg} pa={space.lg} borderWidth={1} borderColor={color.decor}>{item}</VCard>
    );
  };
}
