import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid, Button } from 'semantic-ui-react';
import { SideNavigation } from '@benrevo/benrevo-react-core';
import navigation from './navigation';

class SetupPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node.isRequired,
    client: PropTypes.object.isRequired,
  };

  render() {
    const { client } = this.props;
    const slotTop = () => <Button className="nowrap" color="teal" size="medium" as={Link} fluid to={`/clients/${this.props.client.id}`}>Client Home</Button>;
    return (
      <div className="setup-presentation">
        <Grid stackable container className="section-wrap without-top">
          <Grid.Row>
            <Grid.Column width={16} className="top-padded-empty">
              <SideNavigation
                slotTop={slotTop}
                clientName={client.clientName}
                navigation={navigation}
                urlPrefix={`/clients/${this.props.client.id}/build`}
              />
              <div className="side-navigation-content">
                {this.props.children}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const clientsState = state.get('clients');

  return {
    client: clientsState.get('current').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupPresentation);
