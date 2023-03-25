// @flow
import React from 'react';
import { Flex } from 'grid-styled';
import Container from 'components/styled/Container';

import SearchField from 'components/general/SearchField';

export default () =>
  <div>
    <Container>
      <form>
        <Flex justify="center" align="center">
          <SearchField />
          <i className="fa fa-search" aria-hidden="true" />
        </Flex>
      </form>
    </Container>
  </div>;
