import { Flex, Box } from 'grid-styled';

import ProductList from 'components/liked-products/LikedProducts/List/ProductList';
import Pagination from 'components/liked-products/LikedProducts/Pagination';

export default () =>
  <Box mt={3}>
    <ProductList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
