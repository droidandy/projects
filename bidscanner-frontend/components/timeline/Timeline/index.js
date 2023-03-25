// @flow
import React from 'react';
import styled from 'styled-components';

// import type { EventsByDateGroup } from 'lib/types/EventsByDateGroup';

import { Flex, Box } from 'grid-styled';
import Heading from 'components/styled/Heading';

// import TimelineSection from './TimelineSection';
// import WelcomeSection from './WelcomeSection';
import PostContainer from 'containers/timeline/Timeline/Post/PostContainer';
import UserCard from './UserCard';
import RFQCard from './RFQCard';
import RFQ from './Post/RFQ';
import Product from './Post/Product';
import PostForm from './PostForm';

const MutedTextBox = styled(Box)`
  color: #BCBEC0;
  font-size: 0.75rem;
`;

type Props = {
  recommendedUsers: any[],
  recommendedRFQs: any[],
};

const MainCol = styled(Box)`
  max-width: 520px;
`;

const dataForRFQ = {
  firstName: 'Laura',
  lastName: 'Watts',
  companyName: 'general electric',
  country: 'USA',
  posted: new Date(),
  avatarSrc: '/static/26-26.png',
  closes: new Date(),
  rfqName: 'DIN 438 M2x2 Flathead set screws (grub screws).',
  descriptionText:
    'We urgently need GR.B. Best quality on the market, fair price, quick delivery. We need urgent shipping! Very urgent!',
  tags: ['steel pipes1', 'steel pipes2', 'steel pipes3', 'steel pipes4', 'steel pipes5'],
};

const dataForProduct = {
  firstName: 'Laura',
  lastName: 'Watts',
  companyName: 'general electric',
  country: 'USA',
  posted: new Date(),
  avatarSrc: '/static/26-26.png',
  imgSrc: 'http://via.placeholder.com/518x300',
  closes: new Date(),
  productName: 'Product DIN 438 M2x2 Flathead set screws (grub screws).',
  descriptionText:
    'We have just made a great deal with HEAVYDUTICO and will start shipping the highest quality valves to all our customers next month. Thanks.',
  tags: ['steel pipes1', 'steel pipes2', 'steel pipes3', 'steel pipes4', 'steel pipes5'],
  likeCount: 12,
  commentCount: 7,
  liked: true,
};

const dataForPost = {
  firstName: 'Laura',
  lastName: 'Watts',
  companyName: 'general electric',
  country: 'USA',
  posted: new Date(),
  avatarSrc: '/static/26-26.png',
  imgSrc: 'http://via.placeholder.com/518x300',
  closes: new Date(),
  rfqName: 'DIN 438 M2x2 Flathead set screws (grub screws).',
  descriptionText:
    'We have just made a great deal with HEAVYDUTICO and will start shipping the highest quality valves to all our customers next month. Thanks.',
  tags: ['steel pipes1', 'steel pipes2', 'steel pipes3', 'steel pipes4', 'steel pipes5'],
  likeCount: 12,
  commentCount: 7,
  liked: true,
  comments: [
    {
      id: 0,
      author: 'Kim Milesson',
      message:
        'we worked with mark two times, this was the third one and the business was top noth. Recommended!',
    },
    {
      id: 1,
      author: 'John Snow',
      message:
        'we worked with sansa two times, this was the third one and the business was top noth. Recommended!',
    },
    {
      id: 2,
      author: 'Mister X',
      message:
        'we worked with y two times, this was the third one and the business was top noth. Recommended!',
    },
  ],
};

const companies = [
  { id: '1', name: 'Company1', country: 'USA' },
  { id: '2', name: 'Company2', country: 'USA' },
];

export default ({ recommendedUsers, recommendedRFQs }: Props) =>
  <Flex my={3} wrap>
    <Box w={1} mb={3}>
      <Heading align="left" bold>
        My Timeline
      </Heading>
    </Box>
    <Box w={[1, 1, 'auto']} flex="1 1 auto" mb={[3, 3, 0]}>
      <MainCol>
        <PostForm companies={companies} />
        {/* {eventsByDate.length > 0 ? <TimelineSection eventsByDate={eventsByDate} /> : <WelcomeSection />} */}
        <RFQ {...dataForRFQ} />
        <Product {...dataForProduct} />
        <PostContainer {...dataForPost} />
      </MainCol>
    </Box>
    <Flex w={[1, 1, '145px']} wrap direction="column">
      <Box mt={1}>
        <MutedTextBox w={1}>Who to follow:</MutedTextBox>
        {recommendedUsers.map(user =>
          <Box mt={2}>
            <UserCard key={user.id} {...user} />
          </Box>
        )}
      </Box>
      <Box mt={4}>
        <MutedTextBox w={1}>Recommended RFQs:</MutedTextBox>
        {recommendedRFQs.map(rfq =>
          <Box mt={2}>
            <RFQCard key={rfq.id} {...rfq} />
          </Box>
        )}
      </Box>
    </Flex>
  </Flex>;
