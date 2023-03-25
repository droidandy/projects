import { VCol, VText } from '@invest.wl/mobile';
import { VNewsModel } from '@invest.wl/view/src/News/model/V.News.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVNewsCardProps {
  model: VNewsModel;
}

@observer
export class VNewsCard extends React.Component<IVNewsCardProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VNews card {model.id}</VText></VCol>
    );
  }
}
