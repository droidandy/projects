import React from 'react';
import { Row, Col } from 'reactstrap';
import { Field } from 'redux-form';

import PaginationBox from 'components/forms-components/PaginationBox';

export default () => (
  <Row>
    <Col>
      <Field
        name="pagination"
        component={PaginationBox}
        numberOfPages={25}
        paginationWidth={4}
        currentPageIndex={5}
      />
    </Col>
  </Row>
);
