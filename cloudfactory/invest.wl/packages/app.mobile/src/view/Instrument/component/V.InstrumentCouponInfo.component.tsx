import { VCol, VRow, VText } from '@invest.wl/mobile';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVInstrumentCouponInfoProps {
  // dto: Pick<IDInstrumentDTO, 'Image' | 'Name' | 'SecureCode'>;
}

@observer
export class VInstrumentCouponInfo extends React.Component<IVInstrumentCouponInfoProps> {
  public render() {
    return (
      <VRow>
        <VText>Дивиденды</VText>
        <VCol>
          <VText>Выплата coupon.PaymentDate</VText>
          <VText>coupon.Amount</VText>
        </VCol>
      </VRow>
    );
  }
}
