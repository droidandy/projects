import { CompoundUtils } from '@effectivetrade/effective-mobile/src/view/CompoundUtils';
import { IVFlexProps, IVTextProps, VCol, VFormat, VText } from '@invest.wl/mobile';
import { IVPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';
import { TVThemeSizeBase } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVPortfelPLInstrumentStatProps extends IVFlexProps {
  model: IVPortfelPLByInstrumentModel;
  size?: TVThemeSizeBase;
}

@observer
export class VPortfelPLInstrumentStat extends React.Component<IVPortfelPLInstrumentStatProps> {
  public static MV = (_: IVTextProps) => null;
  public static PL = (_: IVTextProps) => null;

  public render() {
    const { model, children, size, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        <CompoundUtils.Find peers={children} byPeerType={VPortfelPLInstrumentStat.MV}>{e =>
          <VFormat.Number size={size} {...e?.props}>{model.marketValue}</VFormat.Number>
        }</CompoundUtils.Find>
        <CompoundUtils.Find peers={children} byPeerType={VPortfelPLInstrumentStat.PL}>{e => (
          <VText color={model.growColor} {...e?.props}>
            {model.yield} ({model.yieldPercent})
          </VText>
        )}</CompoundUtils.Find>
      </VCol>
    );
  }
}
