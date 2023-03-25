import React, { Component } from 'react';
import { Box, Flex } from 'grid-styled';
import styled from 'styled-components';
import Error from 'components/styled/SimpleError';

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
const Accepted = Status.extend`background-color: green;`;

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

class CompanyApplications extends Component {
  state = {
    error: null,
  };

  clearError = () => this.setState({ error: null });

  rejectApplication = async id => {
    const { onRejectCompanyApplication } = this.props;
    try {
      this.clearError();
      await onRejectCompanyApplication(id);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  };

  acceptApplication = async id => {
    const { onAcceptCompanyApplication } = this.props;
    try {
      this.clearError();
      await onAcceptCompanyApplication(id);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  };

  render() {
    const { applications } = this.props;
    return (
      <Box w={1}>
        {(!applications || applications.length === 0) && (
          <Absence justify="center">There is no applications.</Absence>
        )}
        <Flex mb={1} w={1} justify="center">
          <Error>{this.state.error}</Error>
        </Flex>
        {applications &&
          applications.map(v => {
            const { accepted_at, rejected_at } = v;

            return (
              <Flex key={v.id} mb={1} align="center">
                <CompanyName w={1 / 2}>{`${v.user.first_name} ${v.user.last_name}`}</CompanyName>
                {rejected_at && (
                  <Flex align="center" ml="auto" wrap>
                    <Rejected />
                    <Box ml={1}>Rejected</Box>
                  </Flex>
                )}
                {!rejected_at &&
                !accepted_at && (
                  <Flex align="center" ml="auto" wrap>
                    <Button type="button" onClick={() => this.acceptInvitation(v.id)}>
                      Accept
                    </Button>
                    <Button type="button" onClick={() => this.rejectInvitation(v.id)}>
                      Reject
                    </Button>
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
  }
}

export default CompanyApplications;
