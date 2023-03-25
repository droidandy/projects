import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils';
import { EDPortfelGroup } from '@invest.wl/core';
import { IVFlexProps, IVTextProps, VCol, VFormat, VText } from '@invest.wl/mobile';
import { VPortfelPLGroupModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLGroup.model';
import { TVThemeSizeBase } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVPortfelPLGroupStatProps extends IVFlexProps {
  model: VPortfelPLGroupModel;
  size?: TVThemeSizeBase;
}

@observer
export class VPortfelPLGroupStat extends React.Component<IVPortfelPLGroupStatProps> {
  public static MV = (_: IVTextProps & { children: React.ReactElement }) => null;
  public static PL = (_: IVTextProps) => null;

  @computed
  private get _isRub() {
    const { domain: { groupX: { by } }, itemFirst } = this.props.model;
    return by === EDPortfelGroup.InstrumentId && itemFirst?.domain.type.isMoneyRub;
  }

  constructor(props: IVPortfelPLGroupStatProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, children, size, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        <CompoundUtils.Find peers={children} byPeerType={VPortfelPLGroupStat.MV}>{e => (
          <VFormat.Number size={size} {...e?.props}>
            {e?.props.children}
            {model.marketValue}
          </VFormat.Number>
        )}</CompoundUtils.Find>
        {!this._isRub && (
          <CompoundUtils.Find peers={children} byPeerType={VPortfelPLGroupStat.PL}>{e => (
            <VText mt={'sm'} font={size === 'lg' ? 'body5' : 'body19'} color={model.growColor} {...e?.props}>
              {model.yield} ({model.yieldPercent})
            </VText>
          )}</CompoundUtils.Find>
        )}
      </VCol>
    );
  }
}
