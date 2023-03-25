import { Field } from 'redux-form';
import { Flex } from 'grid-styled';
import styled from 'styled-components';

import SearchTextField from 'components/forms-components/SearchTextField';

import SearchIcon from '../../svg/search.svg';

const Icon = styled.div`margin-bottom: 5px;`;

export default () =>
  <div>
    <Flex w={[1, 1 / 2]} align="flex-end" mt={2}>
      <Field name="string" component={SearchTextField} placeholder="Search My Products" />
      <Icon>
        <SearchIcon />
      </Icon>
    </Flex>
  </div>;
