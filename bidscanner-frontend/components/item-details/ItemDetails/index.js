// @flow
import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import currencyMapper from 'utils/currencyMapper';

import Heading from 'components/styled/Heading';
import BlackButton from 'components/styled/BlackButton';

import SocialButtons from 'components/general/SocialButtons';
import CommentList, { type CommentListProps } from 'components/general/CommentList';
import DecimalRating from 'components/general/DecimalRating';

import Imgs, { type ImgsProps } from 'components/item-details/ItemDetails/Imgs';

import type { Currency } from 'context/types';

type ItemDetailsProps = CommentListProps &
  ImgsProps & {
    name: string,
    price: string,
    currency: Currency,
    likedTimes: number,
    seenTimes: number,
    manufacturer: any[],
    address: string,
    description: string,
    username: string,
    rating: number,
    company: string,
    country: string,
    loggedIn: boolean,
    keywords: string[],
    previewMode?: boolean,
  };

const MutedText = styled(Box)`color: #bcbec0;`;

const KeywordLink = styled.a`
  margin-right: 5px;
  color: black;
  display: inline-block;

  &:hover {
    color: black;
  }
`;

const Col = styled(Box)`
  padding-left: ${props => (props.paddingLeft ? '2em' : 0)};
  margin-top: 2em;
  @media (max-width: 800px) {
    padding-left: 0;
  }
`;

const SubHeading = styled(Box)`
  margin-top: -0.5rem;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.1;
`;

const MoreButton = styled.button`
  color: #74bbe7;
  border: 0 none;
  background-color: transparent;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  outline: none;

  &:focus,
  &:active {
    outline: none;
  }
`;

export default ({
  name,
  price,
  currency,
  likedTimes,
  pictures,
  manufacturer,
  address,
  description,
  username,
  rating,
  company,
  country,
  comments,
  keywords,
  previewMode,
}: ItemDetailsProps) => (
  <Flex wrap>
    <Col w={[1, 1, 1 / 2]}>
      <Heading align="left" bold>
        {name}
      </Heading>
      <SubHeading align="left">
        {price}
        {currencyMapper(currency)}
      </SubHeading>
      <Box>
        <Imgs pictures={pictures} />
      </Box>
      <MutedText>Posted Jul 12, 2017</MutedText>
      <Box mt={3}>
        {keywords.map(keyword => (
          <KeywordLink key={keyword} href={`#${keyword}`}>
            #{keyword}
          </KeywordLink>
        ))}
      </Box>
      <Box mt={3}>{description}</Box>
      <Box mt={3}>Manufactured by {manufacturer}</Box>
      <Box mt={3}>Located in {address}</Box>
      {!previewMode && (
        <Box mt={2}>
          <SocialButtons likes={likedTimes} />
        </Box>
      )}
    </Col>
    <Col w={[1, 1, 1 / 2]} paddingLeft>
      <Flex>
        <Box mr={1}>
          <img src="https://placeimg.com/50/50/people" alt={username} />
        </Box>
        <Box>
          <Heading align="left" bold>
            {username}
          </Heading>
          <SubHeading align="left">
            {company}, {country}
          </SubHeading>
        </Box>
      </Flex>
      <Box mt={2}>
        <DecimalRating rating={rating} />
      </Box>
      {!previewMode && (
        <Box>
          <Box mt={2}>
            <CommentList comments={comments} />
          </Box>
          <Box mt={1}>
            <MoreButton>see more...</MoreButton>
          </Box>
          <Box mt={3}>
            <BlackButton>Send Message</BlackButton>
          </Box>
        </Box>
      )}
    </Col>
  </Flex>
);
