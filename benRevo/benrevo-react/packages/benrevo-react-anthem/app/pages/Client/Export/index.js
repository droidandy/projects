/*
 *
 * Import
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { ExportClient } from '@benrevo/benrevo-react-clients';
import { carrierName } from '../../../../app/config';

export class Export extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ExportClient carrierName={carrierName} />
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Export);
