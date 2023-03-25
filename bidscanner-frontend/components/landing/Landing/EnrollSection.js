// @flow
import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import TypedText, { type TypedTextProps } from 'components/landing/Landing/TypedText';
import { Button, SmallText } from 'components/styled/auth';
import BackgroundImage from './backgroundImage.svg';

export type EnrollSectionProps = TypedTextProps;

const typedStrings = [
  // how to customize strings
  // 'Some <i>strings</i> are slanted',
  // 'Some <strong>strings</strong> are bold',
  // 'HTML characters &times; &copy;',

  'Construction Equipment',
  'Casting Forgings',
  'Construction Services',
  'Electromechanical Products',
  'Construction Materials',
  'Electronic Products',
  'Engineering Services',
  'Fabricated Products',
  'Fasteners',
  'Pressure Equipment',
  'Logistic Equipment',
  'Logistic Services',
  'Manufacturing Equipment',
  'Manufacturing Supplies',
  'Manufacturing Services',
  'Testing Equipment',
  'Metal Products',
  'Minerals & Ores',
  'Mining Equipment',
  'Mining Services',
  'Motors Generators',
  'Office Equipment',
  'Oilfield Equipment',
  'Chemical Products',
  'Pipes,Valves Fittings ',
  'Pumps Compressors',
  'Site Works',
  'Water Distribution',
];

const EnrollSectionWrapper = styled(Flex)`
  background-color: transparent;
  position: relative;
  top: -25em;
  padding: 0;
  height: 120px;
`;

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const EnrollButton = styled(Button)`
  background-color: #ff2929;
  height: 40px;
  width: 240px;
`;

const StyledSmallText = styled(SmallText)`
  font-size: 14px;
  color: black;
`;

export default () => (
  <div>
    <BackgroundImage />
    <EnrollSectionWrapper justify="flex-start" direction="column" align="center">
      <Title>Buy and Sell:</Title>
      <Box mt={1}>
        <TypedText strings={typedStrings} />
      </Box>
      <Box mt={3}>
        <EnrollButton>Enroll free</EnrollButton>
      </Box>
      <Box>
        <StyledSmallText>Market opens 01.01.18</StyledSmallText>
      </Box>
    </EnrollSectionWrapper>
  </div>
);
