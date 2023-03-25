import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Card, Input, Dropdown } from 'semantic-ui-react';

class ClientGAs extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    GAList: PropTypes.array.isRequired,
    fullGAList: PropTypes.array.isRequired,
    gaClientTeamAdd: PropTypes.func.isRequired,
    gaClientTeamAddMember: PropTypes.func.isRequired,
    gaClientTeamRemoveMember: PropTypes.func.isRequired,
    gaClientTeamChangeMember: PropTypes.func.isRequired,
  };

  filterList(list, id) {
    const { GAList } = this.props;
    return list.filter((item) => {
      for (let i = 0; i < GAList.length; i += 1) {
        for (let j = 0; j < GAList[i].length; j += 1) {
          if (GAList[i][j].brokerageId === item.value && item.value !== id && !GAList[i][j].removed) {
            return false;
          }
        }
      }
      return true;
    });
  }

  render() {
    const { GAList, fullGAList, gaClientTeamAdd, gaClientTeamAddMember, gaClientTeamRemoveMember, gaClientTeamChangeMember } = this.props;
    const gaOptions = fullGAList
      .map((item) => ({
        key: item.id,
        value: item.id,
        text: item.name,
      })
    );
    return (
      <Grid stackable style={{ width: '100%', paddingLeft: '0' }}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Header as="h3" className="page-section-heading">General Agents</Header>
          </Grid.Column>
        </Grid.Row>
        { GAList.length > 0 && GAList.map((team, i) => {
          if (team.length > 0) {
            return (<Grid.Row key={`team${i}`}>
              <Grid.Column width={16}>
                <Card fluid>
                  <Card.Content>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={6}>
                          <Header as="h3" className="page-form-set-heading">General Agent</Header>
                          <Dropdown fluid labeled options={gaOptions} disabled search selection value={team[0].brokerageId} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Card.Content>
                  <Card.Content>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={6}>
                          <Header as="h3" className="page-form-set-heading">Email</Header>
                        </Grid.Column>
                        <Grid.Column width={6}>
                          <Header as="h3" className="page-form-set-heading">Full Name (Optional)</Header>
                        </Grid.Column>
                      </Grid.Row>
                      { team.map((ga, gaIndex) => (
                        <Grid.Row key={`${ga.brokerageId}_${gaIndex}`}>
                          <Grid.Column width={2}></Grid.Column>
                          <Grid.Column width={6}>
                            <Input
                              value={ga.email}
                              fluid
                              disabled={!ga.added}
                              onChange={(e) => gaClientTeamChangeMember(i, gaIndex, 'email', e.target.value)}
                            />
                          </Grid.Column>
                          <Grid.Column width={6}>
                            <Input
                              value={ga.fullName || ''}
                              fluid
                              disabled={!ga.added}
                              onChange={(e) => gaClientTeamChangeMember(i, gaIndex, 'fullName', e.target.value)}
                            />
                          </Grid.Column>
                          <span className="client-team-remove" onClick={() => { gaClientTeamRemoveMember(i, gaIndex); }}><Icon name="remove"/></span>
                        </Grid.Row>
                      ))}
                      <Grid.Row>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={6}>
                          <span className="button-add-another" onClick={() => { gaClientTeamAddMember(i); }}><Icon name={'add circle'} color={'blue'} />{team.length > 0 ? 'Add another' : 'Add GA Team Member'}</span>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>);
          }
          return '';
        })}
        <Grid.Row>
          <Grid.Column width={16}>
            <Card fluid>
              <Card.Content>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={6}>
                      <Header as="h3" className="page-form-set-heading">General Agent</Header>
                      <Dropdown value={''} fluid options={this.filterList(gaOptions, -1)} placeholder="Select a General Agent" search selection onChange={(e, inputState) => gaClientTeamAdd(inputState.value)} />
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

export default ClientGAs;
