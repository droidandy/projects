import { Flex, Box } from 'grid-styled';

import ProductList from 'components/suggested-products/SuggestedProducts/List/ProductList';
import Pagination from 'components/suggested-products/SuggestedProducts/Pagination';

export default () =>
  <Box mt={3}>
    <ProductList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
