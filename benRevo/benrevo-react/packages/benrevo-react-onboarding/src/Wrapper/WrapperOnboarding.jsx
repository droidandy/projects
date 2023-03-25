import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { SubNavigation } from '@benrevo/benrevo-react-core';
import messages from './../messages';

class Wrapper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Grid stackable container columns={2} className="section-wrap">
        <Grid.Row columns={2}>
          <Grid.Column width={3}>
            <SubNavigation route={this.props.route} messages={messages} parent="onboarding" />
          </Grid.Column>
          <Grid.Column width={13}>
            {this.props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Wrapper;
