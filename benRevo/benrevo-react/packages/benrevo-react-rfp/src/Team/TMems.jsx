import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { TeamList } from '@benrevo/benrevo-react-core';
import { Grid, Divider, Button, Segment } from 'semantic-ui-react';
import FormBase from '../FormBaseClass';

class TMems extends FormBase {
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
        <Grid container stackable columns={2} className="carrierRfpMainContainer section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <Grid stackable columns={2} as={Segment} className="gridSegment">
                <Grid.Row>
                  <Grid.Column width={16} textAlign="center" >
                    <TeamList
                      loading={this.props.loading}
                      members={this.props.members}
                      updateTeam={this.props.updateTeam}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16} textAlign="left" >
                    <Divider />
                    <div className="pageFooterActions">
                      <Button onClick={() => this.props.continue(true, this.props.prefix)} primary floated={'right'} size="big">Save & Continue</Button>
                      <Button onClick={() => { this.changePage('back'); }} floated={'left'} size="big" basic>Back</Button>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

TMems.propTypes = {
  fetchTeamMembers: PropTypes.func,
  loading: PropTypes.bool,
  members: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  client: PropTypes.string,
  onContinue: PropTypes.func,
  updateTeam: PropTypes.func,
};
export default TMems;
