// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

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
    image: '/static/img/industry.png',
    title: 'Industrial Focus',
    text: 'We help buyers and sellers of industrial goods and services meet and transact safely',
  },
  {
    image: '/static/img/showcase.png',
    title: 'Showcase products, attract buyers',
    text: 'Want to sell? Showcase your products free and sell to new customers or markets',
  },
  {
    image: '/static/img/rfqs.png',
    title: 'Post RFQs, Get Bids',
    text: 'Need to buy? Post your RFQ and attract proposals from trustable suppliers',
  },
  {
    image: '/static/img/stock.png',
    title: 'Find Stock Easily',
    text: 'Loking for delivery from stock? Let stockist see what you need  and fix the issue',
  },
  {
    image: '/static/img/escrow.png',
    title: 'Escrow: Risk Free Deals',
    text: 'Close deals with our escrow payment, the safest and cheapest alternative to letters of credit',
  },
  {
    image: '/static/img/social.png',
    title: 'User Centric and Social',
    text: 'Post and comment news, interact with other members and build a network of followers',
  },
  {
    image: '/static/img/scissors.png',
    title: 'No Subscription Fees',
    text: 'No fixed costs on tradekoo.com. Just pay the services that add real value to your business',
  },
  {
    image: '/static/img/userFriendly.png',
    title: 'User Friendly',
    text: 'Confused by messy B2B portals? You will find  tradekoo.com easy and intuitive',
  },
  {
    image: '/static/img/showcase.png',
    title: 'Made in Switzerland',
    text: 'Tradekoo is the most modern and reliable B2B marketplace on the planet',
  },
];

export default () => (
  <Flex direction="column" align="center">
    <Title>The first Social B2B Marketplace</Title>
    <Flex w={1} justify="space-between" wrap>
      {descriptionItems.map((item, index) => (
        <ItemWrapper key={`item-${index}`} justify="center" w={1 / 3} pl={1} pr={2} align="center">
          <Box w={1 / 4}>
            <img src={item.image} alt="sample" />
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
      ))}
    </Flex>
  </Flex>
);
