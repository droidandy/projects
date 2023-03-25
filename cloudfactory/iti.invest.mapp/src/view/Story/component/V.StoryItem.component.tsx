import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { VStoryModel } from '@invest.wl/view/src/Story/model/V.Story.model';

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
