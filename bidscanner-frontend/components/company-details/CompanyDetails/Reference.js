// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

export type ReferenceProps = {
  title: string,
  customer: string,
  year: number,
  amount: number,
  description: string,
};

const Title = styled(Box)`
  font-size: 18px;
  font-weight: bold;
`;

const SubTitle = styled(Box)`
  font-size: 12px;
  color: #bcbec0;
`;

export default ({ title, customer, year, amount, description }: ReferenceProps) =>
  <Box mt={2} w={3 / 4}>
    <Title>
      {title}
    </Title>
    <Box>
      <SubTitle>
        Customer: {customer}
      </SubTitle>
      <Flex>
        <SubTitle>
          Year: {year} |
        </SubTitle>
        <SubTitle ml={1}>
          Amount: ${amount}
        </SubTitle>
      </Flex>
    </Box>
    <Box mt={1}>
      {description}
    </Box>
  </Box>;
