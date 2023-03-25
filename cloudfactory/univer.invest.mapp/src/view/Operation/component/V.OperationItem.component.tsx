import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { VOperationModel } from '@invest.wl/view/src/Operation/model/V.Operation.model';

export interface IVOperationItemProps {
  model: VOperationModel;
}

@observer
export class VOperationItem extends React.Component<IVOperationItemProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VOperationItem {model.id}</VText></VCol>
    );
  }
}
