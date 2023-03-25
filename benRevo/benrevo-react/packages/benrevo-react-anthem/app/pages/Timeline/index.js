/*
 *
 * TimeLine page
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Timeline } from '@benrevo/benrevo-react-timeline';

export class TimeLinePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    params: PropTypes.object.isRequired,
  };
  render() {
    return (
      <Timeline params={this.props.params} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    params: ownProps.params,
  };
}

export default connect(mapStateToProps)(TimeLinePage);
