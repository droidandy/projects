// @flow
import React from 'react';
import SmallText from 'components/styled/SmallText';
import { Colors } from 'context/colors';
import DecimalRating, { type RatingProps } from 'components/supplier-details/SupplierDetails/DecimalRating';
import Button from 'components/styled/Button';
import { Flex, Box } from 'grid-styled';

import styled from 'styled-components';

const Name = styled.span`
  font-size: 1.2em;
  font-weight: bold;
`;

const Keywords = Name.extend`font-size: 1em;`;

const GrayText = SmallText.extend`
  color: ${Colors.lightGray};
  font-weight: 400;
`;
const StyledButton = Button.extend`
  padding: 0 0.5em;
  height: 2em;
  font-size: 0.6em;
  border-radius: 2px;
  margin-right: 1em;
`;

const CompanyName = styled.span`font-size: 1.2em;`;

export type InfoProps = RatingProps & {
  name: string,
  company: string,
  country: string,
  follows: number,
  followers: number,
  sells: string[],
  buys: string[],
};

export default ({ rating, name, company, follows, followers, country, sells, buys }: InfoProps) =>
  <div>
    <Flex justify="start" align="baseline">
      <Box width={1 / 3}>
        <Name>
          {name}
        </Name>
      </Box>
      <Box width={1 / 5}>
        <GrayText>
          {country}
        </GrayText>
      </Box>
      <Box width={1 / 2}>
        <GrayText>
          follows: {follows} | followers: {followers}
        </GrayText>
      </Box>
    </Flex>
    <Box width={1 / 4}>
      <DecimalRating rating={rating} />
    </Box>
    <Box mt={1}>
      <StyledButton>send message</StyledButton>
      <StyledButton>follow</StyledButton>
      <StyledButton>rate</StyledButton>
      <StyledButton>block</StyledButton>
      <StyledButton>report</StyledButton>
    </Box>
    <Box pt={5}>
      <CompanyName>
        works at @{company}
      </CompanyName>
    </Box>
    <Box pt={5}>
      sells:{' '}
      {sells.map(item =>
        <Keywords>
          {' '}#{item}
        </Keywords>
      )}
    </Box>
    <Box pt={5}>
      buys:{' '}
      {buys.map(item =>
        <Keywords>
          {' '}#{item}
        </Keywords>
      )}
    </Box>
  </div>;
