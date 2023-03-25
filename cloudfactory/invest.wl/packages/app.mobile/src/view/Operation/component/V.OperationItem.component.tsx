import { VCol, VText } from '@invest.wl/mobile';
import { VOperationModel } from '@invest.wl/view/src/Operation/model/V.Operation.model';
import { observer } from 'mobx-react';
import React from 'react';

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
