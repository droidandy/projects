import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Grid, Dimmer, Loader, Segment, Header, Message } from 'semantic-ui-react';

class TeamList extends React.Component {
  render() {
    return (
      <Grid container stackable columns={2}>
        <Dimmer active={this.props.loading} inverted>
          <Loader indeterminate>Fetching Team Members</Loader>
        </Dimmer>
        <Grid.Row>
          <Grid.Column width={16} textAlign="center" >
            <Message warning hidden={!this.props.hasError}>
              <Message.Header>There was an error managing your team. Please refresh and try again.</Message.Header>
            </Message>
            <Header as="h1" className="page-heading">Select members for client team</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16} textAlign="left" >
            <div className="team-select-container" style={{ marginLeft: '80px' }}>
              <Header as="h2" className="sub-heading">Select team members for your client team</Header>
              <Form style={{ minHeight: '200px' }}>
                { this.props.members.map((member, index) =>
                  <Form.Field
                    key={index}
                    control={Checkbox}
                    defaultChecked={!!member.get('id')}
                    onChange={(e, props) => { this.props.updateTeam(member) }}
                    label={<label htmlFor="checkbox">{member.get('fullName')}</label>}
                  />,
                ) }
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

TeamList.propTypes = {
  loading: PropTypes.bool,
  members: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateTeam: PropTypes.func,
};
export default TeamList;
