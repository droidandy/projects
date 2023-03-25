// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import Input from 'components/general/SearchField/Input';
import Filter from 'components/general/SearchField/Filter';

const Search = styled(Box)`
  margin-bottom: 8px;
  margin-right: -25px;
`;

export default ({ autofocus }) =>
  <Flex w={[1, 1 / 2]} align="center">
    <Search flex="1 1 auto">
      <Field name="search" component={Input} autofocus={autofocus} />
    </Search>
    <Field name="filter" component={Filter} />
  </Flex>;
