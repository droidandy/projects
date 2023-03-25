import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Grid } from 'semantic-ui-react';
import messages from './messages';
import { selectedCarrier } from '../../../config';

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const anthem = selectedCarrier.value === 'ANTHEM_BLUE_CROSS';
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              <Menu.Item as={Link} to="/client" activeClassName="active">
                <FormattedMessage {...messages.client} />
              </Menu.Item>
              <Menu.Item as={Link} to="/brokerage" activeClassName="active">
                <FormattedMessage {...messages.brokerage} />
              </Menu.Item>
              { anthem &&
                <Menu.Item as={Link} to="/clear-value" activeClassName="active">
                  <FormattedMessage {...messages.clearValue} />
                </Menu.Item>
              }
              <Menu.Item as={Link} to="/optimizer" activeClassName="active">
                <FormattedMessage {...messages.optimizer} />
              </Menu.Item>
              <Menu.Item as={Link} to="/accounts" activeClassName="active">
                <FormattedMessage {...messages.accounts} />
              </Menu.Item>
              <Menu.Item as={Link} to="/sales" activeClassName="active">
                <FormattedMessage {...messages.sales} />
              </Menu.Item>
              <Menu.Item as={Link} to="/data-access" activeClassName="active">
                <FormattedMessage {...messages.dataAccess} />
              </Menu.Item>
              <Menu.Item as={Link} to="/carrier-files" activeClassName="active">
                <FormattedMessage {...messages.carrierFiles} />
              </Menu.Item>
              <Menu.Item as={Link} to="/plan-design" activeClassName="active">
                <FormattedMessage {...messages.plansDesign} />
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Navigation;
