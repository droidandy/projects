import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import DecimalRating from 'components/styled/DecimalRating';

const MutedTextBox = styled(Box)`
  color: #BCBEC0;
  font-size: 14px;
`;

const Company = styled.span`color: #74bbe7;`;

const UserName = styled(Box)`
  font-size: 18px;
`;

const UserCard = styled(Flex)`
  line-height: 99%;
`;

export default ({ username, rating, company, country }) =>
  <UserCard mt={3}>
    <img src="https://placeimg.com/56/56/people" alt={username} />
    <Box ml={1}>
      <UserName>
        {username}
      </UserName>
      <Box py={5}>
        <DecimalRating rating={rating} />
      </Box>
      <MutedTextBox>
        <Company>@{company}</Company>, {country}
      </MutedTextBox>
    </Box>
  </UserCard>;
