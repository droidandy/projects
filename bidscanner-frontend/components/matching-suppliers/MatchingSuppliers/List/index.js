import { Flex, Box } from 'grid-styled';

import SupplierList from 'components/matching-suppliers/MatchingSuppliers/List/SupplierList';
import Pagination from 'components/matching-suppliers/MatchingSuppliers/Pagination';

export default () =>
  <Box mt={3}>
    <SupplierList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
