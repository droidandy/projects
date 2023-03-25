import { Flex, Box } from 'grid-styled';

import RFQList from 'components/suggested-rfqs/SuggestedRFQs/List/RFQList';
import Pagination from 'components/suggested-rfqs/SuggestedRFQs/Pagination';

export default () =>
  <Box mt={3}>
    <RFQList />
    <Flex justify="center" mt={4}>
      <Pagination />
    </Flex>
  </Box>;
