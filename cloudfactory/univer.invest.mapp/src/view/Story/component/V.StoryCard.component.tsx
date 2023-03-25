import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
import { VStoryModel } from '@invest.wl/view/src/Story/model/V.Story.model';

export interface IVStoryCardProps {
  model: VStoryModel;
}

@observer
export class VStoryCard extends React.Component<IVStoryCardProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VStory {model.id}</VText></VCol>
    );
  }
}
