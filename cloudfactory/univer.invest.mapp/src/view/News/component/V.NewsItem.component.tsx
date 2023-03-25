import React from 'react';
import { observer } from 'mobx-react';
import { VCol, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { VNewsModel } from '@invest.wl/view/src/News/model/V.News.model';

export interface IVNewsItemProps {
  model: VNewsModel;
}

@observer
export class VNewsItem extends React.Component<IVNewsItemProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VText>{model.domain.dto.Title}</VText>
        <VRow>
          <VText>{model.domain.dto.SourceName}</VText>
          <VText>{model.domain.dto.Date}</VText>
        </VRow>
      </VCol>
    );
  }
}
