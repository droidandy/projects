import React from 'react';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

import Input from './Input';

const Action = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  margin-right: ${props => (props.mr ? props.mr : '0px')};
`;

export default ({ avatarSrc }) =>
  <Flex mt={1}>
    <img src={avatarSrc} alt="user avatar" />
    <Box ml={1} flex="1 1 auto">
      <Field name="comment" component={Input} type="text" placeholder="Write Comment..." />
    </Box>
    <Box ml={1}>
      <Action>Post</Action>
    </Box>
  </Flex>;
