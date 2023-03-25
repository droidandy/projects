import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Grid } from 'semantic-ui-react';
import messages from './messages';

class NavigationPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changeCurrentPage: PropTypes.func,
    clientId: PropTypes.string.isRequired,
  };

  render() {
    const { clientId } = this.props;
    return (
      <div className="top-navigation">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              <Menu.Item as={Link} to={`/client/${clientId}/quote`} activeClassName="active">
                <FormattedMessage {...messages.quoteSummary} />
              </Menu.Item>
              <Menu.Item as={Link} to={`/client/${clientId}/enrollment`} activeClassName="active">
                <FormattedMessage {...messages.enrollment} />
              </Menu.Item>
              <Menu.Item className="to-medical" as={Link} to={`/client/${clientId}/medical`} onClick={() => { this.props.changeCurrentPage('medical', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.medical} />
              </Menu.Item>
              <Menu.Item className="to-dental" as={Link} to={`/client/${clientId}/dental`} onClick={() => { this.props.changeCurrentPage('dental', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.dental} />
              </Menu.Item>
              <Menu.Item className="to-vision" as={Link} to={`/client/${clientId}/vision`} onClick={() => { this.props.changeCurrentPage('vision', { currentPage: 'Options' }); }} activeClassName="active">
                <FormattedMessage {...messages.vision} />
              </Menu.Item>
              <Menu.Item className="to-final" as={Link} to={`/client/${clientId}/final`} activeClassName="active">
                <FormattedMessage {...messages.finalSelections} />
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default NavigationPresentation;
