import { VCol, VText } from '@invest.wl/mobile';
import { IVCustomerAccountSelfModel } from '@invest.wl/view/src/Customer/model/V.CustomerAccountSelf.model';
import { observer } from 'mobx-react';
import React from 'react';

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
