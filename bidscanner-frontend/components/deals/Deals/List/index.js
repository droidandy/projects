import { Flex, Box } from 'grid-styled';

import Deals from 'components/deals/Deals/List/Deals';
import Pagination from 'components/deals/Deals/Pagination';

export default ({ deals }) =>
  <Box mt={1}>
    <Deals deals={deals} />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
