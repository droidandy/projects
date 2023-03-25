import React from 'react';
import { ReviewCharterView } from './ReviewCharter/ReviewCharterView';
import { ProjectReviewHeader } from './ProjectReviewHeader';
import { Content, Container } from './style';

export const ProjectReview = () => {
  return (
    <Content>
      <ProjectReviewHeader />
      <Container>
        <ReviewCharterView />
      </Container>
    </Content>
  )

};
