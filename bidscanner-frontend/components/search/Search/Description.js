// @flow
import styled from 'styled-components';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import SortBy from 'components/forms-components/dropdowns/SortBy';

const Description = styled(Flex)`
  color: #BCBEC0;
  font-size: 15px;
  margin-bottom: 40px;
`;

const Dropdown = styled(Box)``;

const Type = styled(Box)`color: #ff2929;`;

export default ({ number, entity }) =>
  <Description mt={3} wrap>
    Showing {number} <Type mx={1}>{entity}</Type> by{' '}
    <Dropdown ml={1}>
      <Field name="sort-by" component={SortBy} />
    </Dropdown>
  </Description>;
