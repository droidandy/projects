import styled from 'styled-components';
import { Flex } from 'grid-styled';
import { Field } from 'redux-form';

import { Link } from 'next-url-prettifier';
import StyledLink from 'components/styled/StyledLink';

import SearchTextField from 'components/forms-components/SearchTextField';
import Options from 'components/forms-components/dropdowns/Options';

import SearchIcon from '../../svg/search.svg';

const Search = styled.div`
  border-bottom: 1px solid #e1e1e1;
  padding-left: 5px;
`;

export default ({ query }) => (
  <Flex align="flex-end" w={[1]} mt={1}>
    <Field name="string" component={SearchTextField} placeholder="What are you looking for?" header />
    <Field name="entity" component={Options} options={['Products', 'Requests', 'Suppliers']} />
    <Search>
      <StyledLink color="white">
        <Link
          href={{
            pathname: '/general/search',
            query,
          }}
          as={{
            pathname: '/search',
            query,
          }}
        >
          <a>
            <SearchIcon />
          </a>
        </Link>
      </StyledLink>
    </Search>
  </Flex>
);
