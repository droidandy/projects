import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { VPortfelPLInstrumentItem } from './V.PortfelPLInstrumentItem.component';
import { VList } from '@invest.wl/mobile/src/view/kit';

export interface IVPortfelPLInstrumentListProps {
  list: VPortfelPLByInstrumentModel[];
  onPress(model: VPortfelPLByInstrumentModel): void;
}

@observer
export class VPortfelPLInstrumentList extends React.Component<IVPortfelPLInstrumentListProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { list } = this.props;
    return (
      <FlatList data={list} renderItem={this.itemRender}
        ItemSeparatorComponent={VList.Separator} />
    );
  }

  private itemRender = (data: ListRenderItemInfo<VPortfelPLByInstrumentModel>) =>
    <VPortfelPLInstrumentItem pa={this.theme.space.lg} model={data.item} onPress={this.props.onPress} />;
}
