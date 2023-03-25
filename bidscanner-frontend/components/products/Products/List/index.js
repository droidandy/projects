import { Flex, Box } from 'grid-styled';

import ProductList from 'components/products/Products/List/ProductList';
import Pagination from 'components/products/Products/Pagination';

export default () =>
  <Box mt={4}>
    <ProductList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
