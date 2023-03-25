import { VCol, VRow, VText } from '@invest.wl/mobile';
import { VOrderItemModel } from '@invest.wl/view/src/Order/model/V.OrderItem.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVOrderDeleteProps {
  model: VOrderItemModel;
}

@observer
export class VOrderDelete extends React.Component<IVOrderDeleteProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VText>Удалить заявку?</VText>
        <VText>покупка 10 акций</VText>
        <VRow justifyContent={'space-between'}>
          <VText>{model.domain.dto.Instrument.Name}</VText>
          <VText>{model.domain.dto.Payment}</VText>
        </VRow>
        <VRow justifyContent={'space-between'}>
          <VText>{model.domain.dto.AccountId}</VText>
          <VText>{model.domain.dto.Price}</VText>
        </VRow>
        <VRow justifyContent={'space-between'}>
          <VText>Статус: {model.domain.dto.Status}</VText>
          <VText>{model.domain.dto.Date}</VText>
        </VRow>
      </VCol>
    );
  }
}
