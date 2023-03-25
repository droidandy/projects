import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import BlackButton from 'components/styled/BlackButton';

const Container = styled.div`
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h2`font-size: 2em;`;
const Subtitle = styled.h6`margin-bottom: 16px;`;

const Button = styled(BlackButton)`
  padding-left: 0;
  padding-right: 0;
  width: 100%;
`;

export default ({ onNext }) =>
  <Container>
    <Title>Congratulations</Title>
    <Subtitle>Product posted successfully</Subtitle>
    <Box>
      <img src="/static/img/congrats-list.png" alt="Congratulations" />
    </Box>
    <Box mt={2}>
      <Button onClick={onNext}>See matching RFQs</Button>
    </Box>
  </Container>;
