import React from 'react';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import EnterDetails from './icons/enterDetails.svg';
import Deal from './icons/deal.svg';
import Interact from './icons/interact.svg';
import Review from './icons/review.svg';

const items = [
  {
    image: EnterDetails,
    text: 'Enter product details',
  },
  {
    image: Review,
    text: 'Review and post',
  },
  {
    image: Interact,
    text: 'Interact with buyers',
  },
  {
    image: Deal,
    text: 'Close the deal',
  },
];

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const Wrapper = styled(Flex)`margin-top: 5em;`;

export default () => (
  <Wrapper direction="column">
    <Flex justify="center">
      <Title>How it Works</Title>
    </Flex>
    <Wrapper>
      {items.map((item, index) => {
        const Icon = item.image;
        return (
          <Flex key={`item-${index}`} w={1 / 4} direction="column" align="center" justify="center">
            <Icon />
            <span>{item.text}</span>
          </Flex>
        );
      })}
    </Wrapper>
  </Wrapper>
);
