import { Box, Flex } from 'grid-styled';
import styled from 'styled-components';

const CompanyName = styled(Box)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Status = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 50%;
`;

const Rejected = Status.extend`background-color: red;`;
const Pending = Status.extend`background-color: grey;`;
const Accepted = Status.extend`background-color: green;`;

const Absence = styled(Flex)`
  color: #bcbec0;
  font-size: 0.75em;
`;

const CompanyApplications = ({ applications }) => (
  <Box w={1}>
    {(!applications || applications.length === 0) && (
      <Absence justify="center">There is no applications</Absence>
    )}
    {applications &&
      applications.map(app => {
        const { accepted_at, rejected_at } = app;

        return (
          <Flex key={app.id} mb={1}>
            <CompanyName w={1 / 2}>{app.company.name}</CompanyName>
            {rejected_at && (
              <Flex align="center" ml="auto" wrap>
                <Rejected />
                <Box ml={1}>Rejected</Box>
              </Flex>
            )}
            {!rejected_at &&
            !accepted_at && (
              <Flex align="center" ml="auto" wrap>
                <Pending />
                <Box ml={1}>Pending</Box>
              </Flex>
            )}
            {accepted_at && (
              <Flex align="center" ml="auto" wrap>
                <Accepted />
                <Box ml={1}>Accepted</Box>
              </Flex>
            )}
          </Flex>
        );
      })}
  </Box>
);

export default CompanyApplications;
