import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { IVCustomerAccountSelfModel } from '@invest.wl/view/src/Customer/model/V.CustomerAccountSelf.model';

export interface IVCustomerAccountSelfProps {
  model: IVCustomerAccountSelfModel;
}

@observer
export class VCustomerAccountSelf extends React.Component<IVCustomerAccountSelfProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VUserSelf {model.id}</VText></VCol>
    );
  }
}
