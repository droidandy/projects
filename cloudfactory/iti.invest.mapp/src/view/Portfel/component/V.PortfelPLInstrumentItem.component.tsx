import React from 'react';
import { observer } from 'mobx-react';
import { IVFlexProps, VRow, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { VInstrumentIdentity } from '../../Instrument/component/V.InstrumentIdentity.component';
import { IVPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';
import { VPortfelPLInstrumentStat } from './V.PortfelPLInstrumentStat.component';

export interface IVPortfelPLInstrumentItemProps extends IVFlexProps {
  model: IVPortfelPLByInstrumentModel;
  onPress(model: IVPortfelPLByInstrumentModel): void;
}

@observer
export class VPortfelPLInstrumentItem extends React.Component<IVPortfelPLInstrumentItemProps> {
  public render() {
    const { model, onPress, ...flexProps } = this.props;

    return (
      <VTouchable.Opacity context={model} onPress={onPress} disabled={model.linkDisabled}>
        <VRow justifyContent={'space-between'} alignItems={'center'} {...flexProps}>
          <VInstrumentIdentity flex mpart={model.identity} />
          <VPortfelPLInstrumentStat alignItems={'flex-end'} model={model} />
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
