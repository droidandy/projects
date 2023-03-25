// @flow
import React from 'react';
import styled from 'styled-components';

import { Flex, Box } from 'grid-styled';

const size = 30;

const Container = styled(Flex)`
  line-height: ${size}px;
`;

const RoundedButton = styled(Box)`
  background-color: #E1E1E1;
  width: ${size}px;
  height: ${size}px;
  margin-right: 3px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  & > i {
    color: white;
  }
`;

export type SocialButtonsProps = {
  likes: number,
};

export default ({ likes }: SocialButtonsProps) =>
  <Container>
    <Flex mr={2}>
      <RoundedButton>
        <i className="fa fa-linkedin" aria-hidden="true" />
      </RoundedButton>
      <RoundedButton>
        <i className="fa fa-envelope-o" aria-hidden="true" />
      </RoundedButton>
    </Flex>
    <RoundedButton>
      <i className="fa fa-heart" aria-hidden="true" />
    </RoundedButton>
    {likes && likes > 0 ? likes : ''}
  </Container>;
