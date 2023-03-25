import { VCol, VRow, VText } from '@invest.wl/mobile';
import { VInstrumentAlertModel } from '@invest.wl/view/src/InstrumentAlert/model/V.InstrumentAlert.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVInstrumentAlertDeleteProps {
  model: VInstrumentAlertModel;
}

@observer
export class VInstrumentAlertDelete extends React.Component<IVInstrumentAlertDeleteProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VText>Удалить уведомление?</VText>
        <VRow justifyContent={'space-between'}>
          <VText>{model.domain.dto.Instrument.Name}</VText>
          <VText>{model.domain.dto.TargetPrice}</VText>
        </VRow>
        <VRow justifyContent={'space-between'}>
          <VText>Осталось до исполнения</VText>
          <VText>{model.domain.dto.PointToTargetPrice}</VText>
        </VRow>
      </VCol>
    );
  }
}
