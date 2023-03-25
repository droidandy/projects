import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { SubNavigation } from '@benrevo/benrevo-react-core';
import messages from './../messages';

class SectionRfp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    hideNav: PropTypes.bool,
    prefix: PropTypes.string,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
  };

  render() {
    const { hideNav } = this.props;
    return (
      <Grid stackable container columns={2} className="medicalRfpMainContainer section-wrap">
        <Grid.Row columns={2}>
          { !hideNav &&
            <Grid.Column width={3}>
              <SubNavigation route={this.props.route} messages={messages} products={this.props.products} prefix={this.props.prefix} virginCoverage={this.props.virginCoverage} parent="rfp" />
            </Grid.Column>
          }
          <Grid.Column width={!hideNav ? 13 : 16}>
            {this.props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SectionRfp;
