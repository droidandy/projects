// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import { Colors } from 'context/colors';
import AttachIcon from 'material-ui/svg-icons/editor/attach-file';
import styled from 'styled-components';

const Title = styled.span`
  font-size: 0.8em;
  color: ${Colors.lightGray};
`;

const Document = styled.span`
  color: #74bbe7;
  font-size: 1em;
`;

const StyledIcon = styled(AttachIcon) `
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  margin-left: -0.3em;
`;

export type FilesProps = {
  files: Array<{
    name: string,
    path: string,
  }>,
};

export default ({ files }: FilesProps) =>
  <Box>
    <Box mt={3}>
      <Title>Atached Documents</Title>
    </Box>
    {files.map((file, index) =>
      <Flex align="center" mt={1} key={`file-${index}`}>
        <StyledIcon color={Colors.lightGray} />
        <a href={file.path} download={file.name}>
          <Document>
            {file.name}
          </Document>
        </a>
      </Flex>
    )}
  </Box>;
