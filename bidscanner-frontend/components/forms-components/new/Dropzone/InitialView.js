// @flow
import React from 'react';
import styled from 'styled-components';

import { Flex, Box } from 'grid-styled';
import ButtonAsText from 'components/styled/ButtonAsText';
import UploadIcon from './upload.svg';

const Button = styled(ButtonAsText)`
  text-decoration: underline;
`;

type Props = {
  onOpen: () => void,
};

export default ({ onOpen }: Props) =>
  <Flex align="center" column p={1}>
    <UploadIcon />
    <Box mt={1}>
      <Button type="button" onClick={onOpen}>
        Drag and drop files or click here to browse
      </Button>
    </Box>
  </Flex>;
