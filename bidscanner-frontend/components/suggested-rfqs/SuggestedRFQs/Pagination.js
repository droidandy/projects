import React from 'react';
import { Flex } from 'grid-styled';
import { Field } from 'redux-form';

import Pagination from 'components/forms-components/Pagination';

export default () =>
  <Flex>
    <Field name="page" component={Pagination} numberOfPages={12} paginationWidth={6} currentPageIndex={1} />
  </Flex>;
