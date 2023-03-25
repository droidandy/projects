// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import Heading from 'components/styled/Heading';
import CommentList, { type CommentListProps } from 'components/general/CommentList';
import SocialButtons, { type SocialButtonsProps } from 'components/general/SocialButtons';
import DecimalRating from 'components/general/DecimalRating';
import KeywordList, { type KeywordListProps } from 'components/general/KeywordList';
import Meta, { type MetaProps } from 'components/rfq-details/RFQDetails/Meta';
import Description, { type DescriptionProps } from 'components/rfq-details/RFQDetails/Description';
import Files, { type FilesProps } from 'components/rfq-details/RFQDetails/Files';
import BlackButton from 'components/styled/BlackButton';
import DeliveryDetails, {
  type DeliveryDetailsProps,
} from 'components/rfq-details/RFQDetails/DeliveryDetails';

type RFQDetailsProps = CommentListProps &
  FilesProps &
  MetaProps &
  DescriptionProps &
  DeliveryDetailsProps &
  SocialButtonsProps &
  KeywordListProps & {
    name: string,
    username: string,
    rating: number,
    company: string,
    country: string,
    likedTimes: number,
    previewMode: boolean,
  };

const Col = styled(Box)`@media (max-width: 800px) {margin-top: 2em;}`;

const SubHeading = styled(Box)`
  margin-top: -.5rem;
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
`;

export default ({
  name,
  created,
  purchase,
  keywords,
  shippingAddress,
  expireTime,
  deliveryDate,
  description,
  username,
  rating,
  company,
  likedTimes,
  country,
  comments,
  files,
  previewMode,
}: RFQDetailsProps) => (
  <Flex wrap>
    <Col w={[1, 1, 1 / 2]} pr={2}>
      <Heading align="left" bold>
        {name}
      </Heading>
      <Meta created={created} purchase={purchase} expireTime={expireTime} />
      <Box mt={2}>
        <KeywordList keywords={keywords} />
      </Box>
      <Flex mt={1}>
        <Description description={description} />
      </Flex>
      <DeliveryDetails
        expireTime={expireTime}
        deliveryDate={deliveryDate}
        shippingAddress={shippingAddress}
      />
      <Files files={files} />
      {!previewMode && (
        <Box mt={4}>
          <SocialButtons likes={likedTimes} />
        </Box>
      )}
    </Col>
    <Col w={[1, 1, 1 / 2]} pl={[0, 0, 2]}>
      <Flex align="center">
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
