// @flow
import React from 'react';
import { Flex } from 'grid-styled';
import { Field } from 'redux-form';
import Container from 'components/styled/Container';

import Options from 'components/forms-components/dropdowns/Options';
import SearchTextField from 'components/forms-components/SearchTextField';

export default () => (
  <div>
    <Container>
      <form>
        <Flex justify="center">
          <Flex w={[1, 1 / 2]} align="flex-end" pl={[1, 0]} pr={[1, 0]}>
            <Field name="string" component={SearchTextField} placeholder="What are you looking for?" />
            <Field name="entity" component={Options} options={['Products', 'Requests', 'Suppliers']} />
          </Flex>
        </Flex>
      </form>
    </Container>
  </div>
);
