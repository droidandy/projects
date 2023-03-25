import { VCard, VCol, VText } from '@invest.wl/mobile';
import { VNewsModel } from '@invest.wl/view/src/News/model/V.News.model';
import { observer } from 'mobx-react';
import React from 'react';
import { VNewsItem } from './V.NewsItem.component';

export interface IVNewsProps {
  model: VNewsModel;
}

@observer
export class VNews extends React.Component<IVNewsProps> {
  public render() {
    const { model } = this.props;

    return (
      <VCol>
        <VNewsItem model={model} />
        <VCard>
          <VText>{model.domain.dto.Body}</VText>
        </VCard>
      </VCol>
    );
  }
}
