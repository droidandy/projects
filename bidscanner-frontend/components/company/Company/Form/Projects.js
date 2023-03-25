// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

const Name = styled(Box)`
  font-size: 16px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

const Absence = styled(Flex)`
  color: #bcbec0;
  font-size: 0.75em;
`;

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <Absence justify="center">There is no references yet.</Absence>;
  }

  return (
    <Box w={1}>
      {projects.map(({ id, name }) => (
        <Flex w={1} key={`certificate-${id}`} mt={1} wrap>
          <Name w={1 / 2}>{name}</Name>
          <Box ml="auto">
            <Button type="button">Update</Button>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default Projects;
