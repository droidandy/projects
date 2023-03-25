import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Icon, Grid } from 'semantic-ui-react';
import messages from './messages';

class NavigationPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
    changeCurrentPage: PropTypes.func,
  };

  render() {
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              <Menu.Item as={Link} className="clientName">
                {this.props.client.clientName &&
                <div className="client-item">Client: <span>{this.props.client.clientName}</span></div>
                }
              </Menu.Item>
              <Menu.Item as={Link} to={`/presentation/${this.props.client.id}/quote`} activeClassName="active">
                <FormattedMessage {...messages.quoteSummary} />
              </Menu.Item>
              <Menu.Item as={Link} to={`/presentation/${this.props.client.id}/enrollment`} activeClassName="active">
                <FormattedMessage {...messages.enrollment} />
              </Menu.Item>
              <Menu.Item className="to-medical" as={Link} to={`/presentation/${this.props.client.id}/medical`} onClick={() => { this.props.changeCurrentPage('medical', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.medical} />
              </Menu.Item>
              <Menu.Item className="to-dental" as={Link} to={`/presentation/${this.props.client.id}/dental`} onClick={() => { this.props.changeCurrentPage('dental', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.dental} />
              </Menu.Item>
              <Menu.Item className="to-vision" as={Link} to={`/presentation/${this.props.client.id}/vision`} onClick={() => { this.props.changeCurrentPage('vision', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.vision} />
              </Menu.Item>
              <Menu.Item className="to-final" as={Link} to={`/presentation/${this.props.client.id}/final`}>
                <FormattedMessage {...messages.finalSelections} />
                <span className="folder-icon-image"></span>
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default NavigationPresentation;
