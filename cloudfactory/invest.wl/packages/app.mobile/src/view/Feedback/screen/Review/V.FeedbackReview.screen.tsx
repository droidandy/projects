import { IoC } from '@invest.wl/core';
import { VCol, VContainer, VContent, VNavBar, VStatusBar } from '@invest.wl/mobile';
import {
  IVFeedbackReviewPresentProps,
  VFeedbackReviewPresent,
  VFeedbackReviewPresentTid,
} from '@invest.wl/view/src/Feedback/present/V.FeedbackReview.present';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVFeedbackReviewScreenProps extends IVFeedbackReviewPresentProps {
}

@observer
export class VFeedbackReviewScreen extends React.Component<IVFeedbackReviewScreenProps> {
  private pr = IoC.get<VFeedbackReviewPresent>(VFeedbackReviewPresentTid);

  constructor(props: IVFeedbackReviewScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Оставить отзыв'} />
        </VNavBar>
        <VContent footerTabs>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    return (
      <VCol flex />
    );
  }
}
