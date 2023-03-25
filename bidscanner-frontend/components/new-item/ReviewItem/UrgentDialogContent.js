import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import MutedText from 'components/styled/MutedText';
import ButtonAsText from 'components/styled/ButtonAsText';
import BlackButton from 'components/styled/BlackButton';

import Feature1Pic from './feature1.svg';

const Container = styled.div`
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 2em;
  margin-bottom: 16px;
`;

const Price = styled.span`font-size: 2em;`;
const ButtonAsTextBlack = styled(ButtonAsText)`
  color: black;
`;

const FeautureRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  text-align: left;
`;

const ImgCol = styled.div`flex: 1 1 auto;`;
const TextCol = styled.div`width: 120px;`;

const Button = styled(BlackButton)`
  padding-left: 0;
  padding-right: 0;
  width: 100%;
`;

export default ({ onNext }) =>
  <Container>
    <Title>Premium Product?</Title>
    <FeautureRow>
      <ImgCol>
        <Feature1Pic />
      </ImgCol>
      <TextCol>Get 10 times more views.</TextCol>
    </FeautureRow>
    <FeautureRow>
      <ImgCol>
        <img src="/static/img/feature2.png" alt="Get to the top of the search" />
      </ImgCol>
      <TextCol>Get to the top of the search.</TextCol>
    </FeautureRow>
    <FeautureRow>
      <ImgCol>
        <img src="/static/img/feature3.png" alt="Get to the top of the search" />
      </ImgCol>
      <TextCol>Receive eye-catching badge.</TextCol>
    </FeautureRow>
    <Box mt={3}>
      <Price>Total Price: $4.99</Price>
    </Box>
    <Box mt={1}>
      <Button onClick={onNext}>Post Premium Product</Button>
    </Box>
    <MutedText.Box mt={1}>
      By publishing you accept the charges and agree to our{' '}
      <MutedText.Link href="/termsofuse" target="_blank" rel="noopener noreferrer">
        Terms and Conditions
      </MutedText.Link>.
    </MutedText.Box>
    <Box mt={2}>
      <ButtonAsTextBlack onClick={onNext}>Post without promotion>></ButtonAsTextBlack>
    </Box>
  </Container>;
