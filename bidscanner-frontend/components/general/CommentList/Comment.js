// @flow
import React from 'react';
import styled from 'styled-components';
import { Box } from 'grid-styled';

const Message = styled.span`
  margin-left: 0.5em;
  font-size: 1em;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 1em;
`;

export type CommentProps = {
  username: string,
  message: string,
};

export default ({ username, message }: CommentProps) =>
  <Box mt={2}>
    <Username>
      {username}:
    </Username>
    <Message>
      {message}
    </Message>
  </Box>;
