// @flow
import React from 'react';
import { Row, Col } from 'reactstrap';
import RFQ, { type RFQProps } from 'components/rfq-list/RFQList/RFQList/RFQ';

export type RFQListProps = {
  rfqs: RFQProps[]
};

export default ({ rfqs }: RFQListProps) => (
  <Row>
    <Col>
      {/* TODO: keys */}
      {rfqs.map(rfq => <RFQ {...rfq} />)}
    </Col>
  </Row>
);
