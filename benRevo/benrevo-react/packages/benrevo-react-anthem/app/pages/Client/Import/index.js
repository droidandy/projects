/*
 *
 * Import
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { ImportClient } from '@benrevo/benrevo-react-clients';
import { carrierName } from '../../../../app/config';


export class Import extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {};

  render() {
    return (
      <ImportClient carrierName={carrierName} />
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Import);
