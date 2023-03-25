// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import Industries from './icons/industries.svg';
import Showcase from './icons/showcase.svg';
import Rfqs from './icons/rfqs.svg';
import Stock from './icons/stock.svg';
import Escrow from './icons/escrow.svg';
import Social from './icons/social.svg';
import Scissors from './icons/scissors.svg';
import UserFriendly from './icons/userFriendly.svg';
import SwissFlag from './icons/swissFlag.svg';

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const ItemWrapper = styled(Flex)`margin-top: 100px;`;

const ItemTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const ItemText = styled.div`font-size: 14px;`;

const descriptionItems = [
  {
    image: Industries,
    title: 'Industrial Focus',
    text: 'We help buyers and sellers of industrial goods and services meet and transact safely',
  },
  {
    image: Showcase,
    title: 'Showcase products, attract buyers',
    text: 'Want to sell? Showcase your products free and sell to new customers or markets',
  },
  {
    image: Rfqs,
    title: 'Post RFQs, Get Bids',
    text: 'Need to buy? Post your RFQ and attract proposals from trustable suppliers',
  },
  {
    image: Stock,
    title: 'Find Stock Easily',
    text: 'Loking for delivery from stock? Let stockist see what you need  and fix the issue',
  },
  {
    image: Escrow,
    title: 'Escrow: Risk Free Deals',
    text: 'Close deals with our escrow payment, the safest and cheapest alternative to letters of credit',
  },
  {
    image: Social,
    title: 'User Centric and Social',
    text: 'Post and comment news, interact with other members and build a network of followers',
  },
  {
    image: Scissors,
    title: 'No Subscription Fees',
    text: 'No fixed costs on tradekoo.com. Just pay the services that add real value to your business',
  },
  {
    image: UserFriendly,
    title: 'User Friendly',
    text: 'Confused by messy B2B portals? You will find  tradekoo.com easy and intuitive',
  },
  {
    image: SwissFlag,
    title: 'Made in Switzerland',
    text: 'Tradekoo is the most modern and reliable B2B marketplace on the planet',
  },
];

export default () => (
  <Flex direction="column" align="center">
    <Title>The first Social B2B Marketplace</Title>
    <Flex w={1} justify="space-between" wrap>
      {descriptionItems.map((item, index) => {
        const Icon = item.image;
        return (
          <ItemWrapper key={`item-${index}`} justify="center" w={1 / 3} pl={1} pr={2} align="center">
            <Box w={1 / 4}>
              <Icon />
            </Box>
            <Box w={3 / 4}>
              <Box w={1}>
                <ItemTitle>{item.title}</ItemTitle>
              </Box>
              <Box w={7 / 8}>
                <ItemText>{item.text}</ItemText>
              </Box>
            </Box>
          </ItemWrapper>
        );
      })}
    </Flex>
  </Flex>
);
