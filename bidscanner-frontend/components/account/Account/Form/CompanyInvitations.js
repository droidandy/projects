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

class CompanyInvitations extends Component {
  state = {
    error: null,
  };

  clearError = () => this.setState({ error: null });

  rejectInvitation = async invitationId => {
    const { onRejectCompanyInvitation } = this.props;
    try {
      this.clearError();
      await onRejectCompanyInvitation(invitationId);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  };

  acceptInvitation = async invitationId => {
    const { onAcceptCompanyInvitation } = this.props;
    try {
      this.clearError();
      await onAcceptCompanyInvitation(invitationId);
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  };

  render() {
    const { invitations } = this.props;
    return (
      <Box w={1}>
        {(!invitations || invitations.length === 0) && (
          <Absence justify="center">There is no invitations</Absence>
        )}
        <Flex mb={1} w={1} justify="center">
          <Error>{this.state.error}</Error>
        </Flex>
        {invitations &&
          invitations.map(inv => {
            const { accepted_at, rejected_at } = inv;

            return (
              <Flex key={inv.id} mb={1} align="center">
                <CompanyName w={1 / 2}>{inv.company.name}</CompanyName>
                {rejected_at && (
                  <Flex align="center" ml="auto" wrap>
                    <Rejected />
                    <Box ml={1}>Rejected</Box>
                  </Flex>
                )}
                {!rejected_at &&
                !accepted_at && (
                  <Flex align="center" ml="auto" wrap>
                    <Button type="button" onClick={() => this.acceptInvitation(inv.id)}>
                      Accept
                    </Button>
                    <Button type="button" onClick={() => this.rejectInvitation(inv.id)}>
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

export default CompanyInvitations;
