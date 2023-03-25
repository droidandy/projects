import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VProgressBar, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { VPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';

// TODO: need know account total marketValue
export interface IVPortfelPLInstrumentInfoProps {
  model: VPortfelPLByInstrumentModel;
}

@observer
export class VPortfelPLInstrumentInfo extends React.Component<IVPortfelPLInstrumentInfoProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VRow>
          {/* <VAccountIdentify dto={} /> */}
          {/* TODO: account identify not matched standard */}
          <VText>{model.domain.dto.Account.MarketType}</VText>
          <VText>{model.domain.dto.Account.DisplayName}</VText>
        </VRow>
        <VRow justifyContent={'space-between'}>
          <VCol>
            <VText>Штук</VText>
            <VText>{model.domain.amount}</VText>
          </VCol>
          <VCol>
            <VText>Цена покупки</VText>
            <VText>{model.domain.amount}</VText>
          </VCol>
          <VCol>
            <VText>Стоимость</VText>
            <VText>{model.domain.marketValue}</VText>
          </VCol>
          <VCol>
            <VText>Доходность</VText>
            <VText>{model.domain.yield}</VText>
          </VCol>
        </VRow>
        {/* TODO: need know account total marketValue */}
        <VProgressBar percent={10} />
      </VCol>
    );
  }
}
