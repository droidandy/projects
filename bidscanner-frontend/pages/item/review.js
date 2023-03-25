// @flow
import React from 'react';
import { Container } from 'reactstrap';

import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import Layout from 'components/Layout';
import ReviewItem from 'components/new-item/ReviewItem';

import sampleProps from 'components/new-item/sampleData/forReviewItem';

const ReviewNewItemPage = () => (
  <Layout title="Post New Product">
    <div className="mt-5">
      <Container>
        <ReviewItem {...sampleProps} />
      </Container>
    </div>
  </Layout>
);

export default compose(withData, redirectIfNotLogged)(ReviewNewItemPage);
