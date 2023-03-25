/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { Sidebar, Menu, Icon, Grid } from 'semantic-ui-react';
import Header from './Header';
import Footer from './Footer';
import messages from './Footer/messages';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div id="container-center" className="container-center">
        <Grid container>
          <Grid.Column width={16}>
          </Grid.Column>
        </Grid>
        <Sidebar.Pushable id="container-pushable">
          <Helmet
            titleTemplate="%s - BenRevo"
            defaultTitle="BenRevo"
            meta={[
              { name: 'description', content: 'BenRevo' },
            ]}
          />
          <Sidebar
            onClick={this.props.toggleMobileNavigation}
            as={Menu} animation="push"
            width="thin"
            visible={this.props.showMobileNavigation}
            icon="labeled" vertical inverted
          >
            <div>
              <Menu.Item as={Link} to="/" name="home">
                <Icon name="home" />
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/carriers" name="carriers">
                <Icon name="travel" />
                <FormattedMessage {...messages.carriers} />
              </Menu.Item>
              <Menu.Item as={Link} to="/brokers" name="brokers">
                <Icon name="users" />
                <FormattedMessage {...messages.brokers} />
              </Menu.Item>
            </div>
          </Sidebar>
          <Sidebar.Pusher id="container-pusher">
            <Header location={this.props.location.pathname} />
            {React.Children.toArray(this.props.children)}
            <Footer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  toggleMobileNavigation: PropTypes.func,
  showMobileNavigation: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
