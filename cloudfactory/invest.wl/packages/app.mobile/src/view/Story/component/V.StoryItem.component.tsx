import { VCol, VText } from '@invest.wl/mobile';
import { VStoryModel } from '@invest.wl/view/src/Story/model/V.Story.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVStoryItemProps {
  model: VStoryModel;
}

@observer
export class VStoryItem extends React.Component<IVStoryItemProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VStoryItem {model.id}</VText></VCol>
    );
  }
}
