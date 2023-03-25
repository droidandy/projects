import React from 'react';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import GoToTop from './icons/goToTop.svg';
import Views from './icons/views.svg';
import Badge from './icons/badge.svg';

const items = [
  {
    image: GoToTop,
    text: 'Get to the top of the search',
  },
  {
    image: Views,
    text: 'Get 10 times more views',
  },
  {
    image: Badge,
    text: 'Receive eye catching badge',
  },
];

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const Wrapper = styled(Flex)`
  margin-top: 5em;
  background-color: #fafafa;
  padding-top: 5em;
  padding-bottom: 5em;
`;

const ImageWrapper = styled.div`min-height: 100px;`;

const ContentWrapper = styled(Flex)`margin-top: 5em;`;

export default () => (
  <Wrapper direction="column">
    <Flex justify="center">
      <Title>Want to stand out? Pick a premium promotion</Title>
    </Flex>
    <ContentWrapper justify="center">
      {items.map((item, index) => {
        const Image = item.image;
        return (
          <Flex key={`promotion-${index}`} w={1 / 4} direction="column" align="center" justify="center">
            <ImageWrapper>
              <Image />
            </ImageWrapper>
            <span>{item.text}</span>
          </Flex>
        );
      })}
    </ContentWrapper>
    <Flex justify="center" mt={2}>
      <span>only 4.99 &euro; / week</span>
    </Flex>
  </Wrapper>
);
