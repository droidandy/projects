import React from 'react';
import PropTypes from 'prop-types';
import { Preview } from '@benrevo/benrevo-react-rfp';

class PreviewWrap extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  render() {
    const prefix = `/clients/${this.props.params.clientId}`;

    return (
      <div>
        <Preview prefixBackButton={prefix} backButton {...this.props} scale={1.3} />
      </div>


    );
  }
}

export default PreviewWrap;
