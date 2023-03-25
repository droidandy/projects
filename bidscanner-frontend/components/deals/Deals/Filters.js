import styled from 'styled-components';

import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';

import SearchTextField from 'components/forms-components/SearchTextField';
import Filter from 'components/forms-components/dropdowns/Filter';

import SearchIcon from '../../svg/search.svg';

const Icon = styled.div`margin-bottom: 5px;`;

const values = ['Relevance', 'Posting Date', 'Price', 'Alphabetical', 'Company'];
const statuses = ['Shipped', 'Negotiation', 'Funds in Escrow', 'Purchase order', 'Paid', 'Disputed'];

export default ({ query }) => {
  let filterTitle = 'User';
  if (query.type === 'Sell') filterTitle = 'Buyer';
  else if (query.type === 'Buy') filterTitle = 'Seller';
  return (
    <div>
      <Flex w={[1, 1 / 2]} align="flex-end" mt={2}>
        <Field name="string" component={SearchTextField} placeholder="Search in deals" />
        <Icon>
          <SearchIcon />
        </Icon>
      </Flex>
      <Flex mt={1}>
        <Box mr={1}>
          <Field name="user" component={Filter} title={filterTitle} options={values} />
        </Box>
        <Box mr={1}>
          <Field name="status" component={Filter} title="Status" options={statuses} />
        </Box>
      </Flex>
    </div>
  );
};
