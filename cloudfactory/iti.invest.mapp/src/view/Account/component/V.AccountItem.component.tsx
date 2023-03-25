import React from 'react';
import { observer } from 'mobx-react';
import { VAccountModel } from '@invest.wl/view/src/Account/model/V.Account.model';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { VAccountIdentity } from './V.AccountIdentity.component';

export interface IVAccountItemProps {
  model: VAccountModel;
}

@observer
export class VAccountItem extends React.Component<IVAccountItemProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VAccountIdentity mpart={model.identity} />
        <VText>{model.marketValue}</VText>
      </VCol>
    );
  }
}
