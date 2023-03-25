// @flow
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import withData from 'lib/withData';

import Heading from 'components/styled/Heading';
import Layout from 'components/Layout';
import ItemList from 'components/item-list/ItemList';

import sampleData from 'components/item-list/sample-data/for-item-list';

const HomePage = () =>
  <Layout title="Product List">
    <div className="mt-5">
      <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <Heading size="2rem" bold>
              Products on sale
            </Heading>
            <ItemList {...sampleData} />
          </Col>
        </Row>
      </Container>
    </div>
  </Layout>;

export default withData(HomePage);
