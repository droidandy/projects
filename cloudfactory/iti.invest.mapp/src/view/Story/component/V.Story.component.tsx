import React from 'react';
import { observer } from 'mobx-react';
import { VStoryModel } from '@invest.wl/view/src/Story/model/V.Story.model';
import { VCol, VText } from '@invest.wl/mobile/src/view/kit';

export interface IVStoryProps {
  model: VStoryModel;
}

@observer
export class VStory extends React.Component<IVStoryProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol><VText>VStory {model.id}</VText></VCol>
    );
  }
}
