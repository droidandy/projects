// @flow
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import withData from 'lib/withData';

import Heading from 'components/styled/Heading';
import Layout from 'components/Layout';
import RFQList from 'components/rfq-list/RFQList';

import sampleData from 'components/rfq-list/sample-data/for-rfq-list';

const HomePage = () =>
  <Layout title="RFQ List">
    <div className="mt-5">
      <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <Heading size="2rem" bold>
              RFQs
            </Heading>
            <RFQList {...sampleData} />
          </Col>
        </Row>
      </Container>
    </div>
  </Layout>;

export default withData(HomePage);
