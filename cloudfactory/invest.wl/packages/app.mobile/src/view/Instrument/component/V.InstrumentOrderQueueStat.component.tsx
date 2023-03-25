import { VCol, VProgressBar, VRow, VText } from '@invest.wl/mobile';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVInstrumentOrderQueueStatProps {
  // dto: Pick<IDInstrumentDTO, 'Image' | 'Name' | 'SecureCode'>;
}

@observer
export class VInstrumentOrderQueueStat extends React.Component<IVInstrumentOrderQueueStatProps> {
  public render() {
    return (
      <VCol>
        <VRow>
          <VCol>
            <VText>52%</VText>
            <VText>покупают</VText>
          </VCol>
          <VCol>
            <VText>48%</VText>
            <VText>продают</VText>
          </VCol>
        </VRow>
        <VProgressBar percent={45} text />
      </VCol>
    );
  }
}
