import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Menu, Grid } from 'semantic-ui-react';

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
  };


  render() {
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              {this.props.client &&
                <Menu.Item as={Link}>
                  {this.props.client.clientName &&
                  <div>Client: <span>{this.props.client.clientName}</span></div>
                  }
                </Menu.Item>
              }
              {this.props.client &&
                <Menu.Item as={Link}>
                </Menu.Item>
              }
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Navigation;
