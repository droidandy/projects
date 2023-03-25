// @flow
import React from 'react';
import { Flex } from 'grid-styled';
import { Colors } from 'context/colors';
import styled from 'styled-components';

const MetaText = styled.span`
  font-size: 0.8em;
  color: ${Colors.lightGray};
  margin-right: 2em;
`;

const StyledIcon = styled.i`
  color: black;
  margin-right: 0.5em;
`;

export type MetaProps = {
  created: Date,
  purchase: string,
  expireTime: Date,
};

export default ({ created, purchase, expireTime }: MetaProps) =>
  <Flex align="center">
    <MetaText>
      Posted {created.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
    </MetaText>
    <Flex>
      <MetaText>
        <StyledIcon className="fa fa-usd" aria-hidden="true" />
        {purchase}
      </MetaText>
    </Flex>
    <MetaText>
      <StyledIcon className="fa fa-hourglass-end" aria-hidden="true" />
      Closes in {Math.floor((expireTime - new Date()) / (1000 * 60 * 60 * 24))} days
    </MetaText>
  </Flex>;
