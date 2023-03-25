import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Input, Header, Icon, Card } from 'semantic-ui-react';

class ClientTeam extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    title: PropTypes.string.isRequired,
    team: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    addMember: PropTypes.func.isRequired,
    removeMember: PropTypes.func.isRequired,
  };

  render() {
    const { title, team, onChange, addMember, removeMember } = this.props;

    return (
      <Grid stackable style={{ width: '100%', paddingLeft: '0' }}>
        <Grid.Row className="">
          <Grid.Column width={5}>
            <Header as="h3" className="page-section-heading">{title}</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <Grid>
                  { team.length > 0 &&
                    <Grid.Row>
                      <Grid.Column width={2}></Grid.Column>
                      <Grid.Column width={6}>
                        <Header as="h3" className="page-form-set-heading">Email</Header>
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Header as="h3" className="page-form-set-heading">Full Name (Optional)</Header>
                      </Grid.Column>
                    </Grid.Row>
                  }
                  { team.length > 0 && team.map((member, index) =>
                    <Grid.Row key={index}>
                      <Grid.Column width={2}></Grid.Column>
                      <Grid.Column width={6}>
                        <Input
                          fluid
                          name={`${title}teamMemberEmail${index}`}
                          id={`${title}teamMemberEmail${index}`}
                          value={member.email ? member.email : ''}
                          onChange={(e, inputState) => { onChange(index, 'email', inputState.value); }}
                          disabled={!member.added}
                        />
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Input
                          fluid
                          name={`${title}teamMemberName${index}`}
                          id={`${title}teamMemberName${index}`}
                          value={member.fullName ? member.fullName : ''}
                          onChange={(e, inputState) => { onChange(index, 'fullName', inputState.value); }}
                          disabled={!member.added}
                        />
                      </Grid.Column>
                      <span className="client-team-remove" onClick={() => { removeMember(index); }}><Icon name="remove"/></span>
                    </Grid.Row>
                  )}
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={6}>
                      <span className="button-add-another" onClick={() => { addMember(); }}><Icon name={'add circle'} color={'blue'} />{team.length > 0 ? 'Add another' : 'Add Client Team Member'}</span>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ClientTeam;
