import React from 'react';

import Container from 'components/styled/Container';

import Filters from 'components/search/Search/Filters';
import ListContainer from 'containers/search/Search/ListContainer';

export default ({ query }) =>
  <Container>
    <form>
      <Filters autofocus />
      <ListContainer query={query} />
    </form>
  </Container>;
