import { IoC } from '@invest.wl/core';
import { IVFlexProps, VCard, VCarousel, VCarouselIndicator } from '@invest.wl/mobile';
import { IVPortfelPLGroupModel, VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VPortfelPLGroupByAccountForInstrument } from '../../Portfel/component/V.PortfelPLGroupByAccountForInstrument.component';

export interface IVInstrumentPortfelPLByAccountListProps extends IVFlexProps {
  activeIndex: number;
  list: VPortfelPLGroupModel[];
  activeSet(index: number): void;
}

@observer
export class VInstrumentPortfelPLByAccountList extends React.Component<IVInstrumentPortfelPLByAccountListProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { list, activeIndex, activeSet, ...flexProps } = this.props;

    return (
      <VCarousel activeIndex={activeIndex} onSelectIndex={activeSet}
        list={list} itemRenderer={this._itemRender} {...flexProps} />
    );
  }

  private _itemRender = (m: IVPortfelPLGroupModel, index: number) => {
    const { color, space } = this.theme;
    const { list, activeIndex } = this.props;

    return (
      <VCard key={m.id} pa={space.lg} mv={space.md} mh={space.lg}>
        <VPortfelPLGroupByAccountForInstrument model={m}
          countOf={list.length > 1 ? `(${index + 1} из ${list.length})` : undefined}>
          {list.length > 1 && (
            <VCarouselIndicator length={list.length} activeIndex={activeIndex} pt={'md'}
              colorActive={color.baseInvert} />
          )}
        </VPortfelPLGroupByAccountForInstrument>
      </VCard>
    );
  };
}
