import { Flex, Box } from 'grid-styled';

import RFQList from 'components/liked-rfqs/LikedRFQs/List/RFQList';
import Pagination from 'components/liked-rfqs/LikedRFQs/Pagination';

export default () =>
  <Box mt={3}>
    <RFQList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
