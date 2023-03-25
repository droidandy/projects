// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import Clip from '../../svg/clip.svg';

export type DocumentProps = {
  name: string,
  // path: string,
};

const Document = styled(Box)`
  font-size: 16px;
  font-weight: bold;
  color: #74BBE7;
  cursor: pointer;
`;

export default ({ name }: DocumentProps) =>
  <Flex mt={1} align="center">
    <Clip />
    <Box ml={1}>
      <Document>
        {name}
      </Document>
    </Box>
  </Flex>;
