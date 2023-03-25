import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Navigation from './Navigation'
import TeamList from './TeamList'
import { Grid, Divider, Button, Segment, Container } from 'semantic-ui-react';

class TeamMembers extends React.Component {
    componentDidMount() {
      this.props.fetchTeamMembers();
    }

    render() {
      return (
        <div>
          <Helmet
            title="Team"
            meta={[
              { name: 'description', content: 'Team Members' },
            ]}
          />
          <Navigation client={this.props.client}/>
          <Grid container stackable columns={2} as={Segment} className="carrierRfpMainContainer section-wrap">
            <TeamList
              loading={this.props.loading}
              members={this.props.members}
              updateTeam={this.props.updateTeam}
            />
            <Grid.Row>
              <Grid.Column width={16} textAlign="left" >
                <Divider />
                <div className="pageFooterActions">
                  <Button onClick={() => this.props.continue(false)} primary floated={'right'} size='big'>Save</Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
  }

TeamMembers.propTypes = {
  fetchTeamMembers: PropTypes.func,
  loading: PropTypes.bool,
  members: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  client: PropTypes.string,
  onContinue: PropTypes.func,
  updateTeam: PropTypes.func,
};
export default TeamMembers;

