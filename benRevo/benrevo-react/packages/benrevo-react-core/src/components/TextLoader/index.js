/**
*
* TextLoader
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

class TextLoader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props && this.props.loading &&
          <Loader style={{ fontSize: '14px', fontWeight: '300' }} inline active />
        }
        { this.props && !this.props.loading &&
          this.props.children
        }
      </div>
    );
  }
}

TextLoader.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.object,
};

export default TextLoader;
