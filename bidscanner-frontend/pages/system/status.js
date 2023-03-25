// @flow
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import withData from 'lib/withData';
import Layout from 'components/Layout';

import Status from 'components/status/Status';

const StatusPage = ({ url: { query } }) => {
  const prevPage = query.after;
  return (
    <Layout title="Message" verticalCenter>
      <Container>
        <Row>
          <Col>
            <Status prevPage={prevPage} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

StatusPage.getInitialProps = ctx => {
  // removed (not) do we even need this page now
  const previousPage = ctx.query.after;
  if (!previousPage) {
    ctx.res.redirect('/404');
    return {};
  }
  return {};
};

export default withData(StatusPage);
