import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Grid } from 'semantic-ui-react';
import messages from './messages';

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
    routes: PropTypes.array,
  };

  render() {
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              <Menu.Item as={Link} className="clientName">
                {this.props.client.clientName &&
                <div>Client: <span>{this.props.client.clientName}</span></div>
                }
              </Menu.Item>
              {this.props.routes.map((item) => {
                if (item.path === 'send' || item.path === 'employer-app') return (<div key={item.path} />);
                return (
                  <Menu.Item as={Link} to={`/onboarding/${item.path}`} activeClassName="active" key={item.path}>
                    <FormattedMessage {...messages[item.path]} />
                  </Menu.Item>
                );
              })}

              <Menu.Item as={Link} to="/onboarding/send">
                {/* <Label className='responsive-nav-carrier-label'>1</Label>*/}
                <FormattedMessage {...messages.sendToCarrier} />
                <span className="folder-icon-image"></span>
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Navigation;
