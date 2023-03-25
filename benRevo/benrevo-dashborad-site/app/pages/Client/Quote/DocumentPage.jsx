import React from 'react';
import PropTypes from 'prop-types';
import {
  Documents,
} from '@benrevo/benrevo-react-quote';

class DocumentPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params } = this.props;

    return (
      <Documents
        {...this.props}
        baseLink={`/client/${params.clientId}`}
      />
    );
  }
}

export default DocumentPage;
