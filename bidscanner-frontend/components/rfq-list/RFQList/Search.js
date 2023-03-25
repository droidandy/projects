import React from 'react';
import { Row, Col } from 'reactstrap';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Input from 'components/forms-components/Input';
import CountryFilter from 'components/forms-components/CountryFilter';
import Button from 'components/styled/FormButton';

const SearchField = styled.div`
  flex: 1 1 auto;
`;

export default () => (
  <Row>
    <Col>
      <form className="d-flex justify-content-start">
        <SearchField>
          <Field name="input" component={Input} type="text" placeholder="Refine your search" />
        </SearchField>
        <div>
          <Field name="country" component={CountryFilter} />
        </div>
        <div>
          <Button>Filter</Button>
        </div>
      </form>
    </Col>
  </Row>
);
