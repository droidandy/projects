import { Flex, Box } from 'grid-styled';

import RFQList from 'components/rfqs/RFQs/List/RFQList';
import Pagination from 'components/rfqs/RFQs/Pagination';

export default () =>
  <Box mt={4}>
    <RFQList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
