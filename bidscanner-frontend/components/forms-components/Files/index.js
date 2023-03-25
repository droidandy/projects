// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { compose, mapProps, withHandlers } from 'recompose';

import Clip from './clip.svg';

const Document = styled(Box)`
  font-size: 16px;
  font-weight: bold;
  color: #74bbe7;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Button = styled.button`
  border: 1px solid black;
  padding: 0px 10px;
  background-color: white;
  border-radius: 2px;
  margin-left: 5px;

  :hover {
    cursor: pointer;
    background-color: #e8e8e8;
  }
`;

const Files = compose(
  mapProps(({ input }) => ({
    files: input.value.data.map(v => input.value.objectMapper(v)) || [],
    updateFiles: input.onChange,
  })),
  withHandlers({
    deleteFile: ({ files, updateFiles }) => fileId => updateFiles(files.filter(file => file.id !== fileId)),
  })
)(({ files, deleteFile }) => (
  <Box w={1}>
    {files.map(file => (
      <Flex w={1} mt={1} key={`file-${file.id}`} align="center" wrap>
        <Clip />
        <Document ml={1} w={1 / 2}>
          {file.name}
        </Document>
        <Button type="button" onClick={() => deleteFile(file.id)}>
          Delete
        </Button>
      </Flex>
    ))}
  </Box>
));

export default Files;
