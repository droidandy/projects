import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { Button } from 'components/styled/auth';
import Background from './icons/background.svg';

const Wrapper = styled(Flex)`margin-top: 5em;`;
const InnerWrapper = styled(Box)`margin-top: 3em;`;

const descriptionTags = [
  'Free advertising',
  'Easy to find buyers',
  'Seen by your followers',
  'Indexed by google and Bing',
  'Listed on Linkedin and Facebok',
  'Open for likes, comments and social sharing',
  'Notified to matching buyers  automatically',
];

const DescriptionItem = styled(Flex)`margin-top: 1em;`;
const DescriptionText = styled.span`margin-left: 1em;`;

const Title = styled.span`
  font-size: 26px;
  font-weight: bold;
`;

const EnrollButton = styled(Button)`
  background-color: #ff2929;
  height: 40px;
  width: 240px;
`;

export default () => (
  <Wrapper>
    <Box w={7 / 12}>
      <Background />
    </Box>
    <InnerWrapper w={5 / 12}>
      <Title>Post unlimited products</Title>
      {descriptionTags.map((tag, index) => (
        <DescriptionItem key={`description-${index}`}>
          <img src="/static/img/services/checkmark.png" alt="sample" />
          <DescriptionText>{tag}</DescriptionText>
        </DescriptionItem>
      ))}
      <InnerWrapper>
        <Box w={3 / 5}>
          <Title>Unparalleled visibility for your products to boost sales!</Title>
        </Box>
      </InnerWrapper>
      <InnerWrapper>
        <EnrollButton>Enroll Free</EnrollButton>
      </InnerWrapper>
    </InnerWrapper>
  </Wrapper>
);
