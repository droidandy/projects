import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete as AntAutoComplete } from 'antd';

export default class AutoComplete extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    dataName: PropTypes.string
  };

  render() {
    const { error, dataName, ...rest } = this.props;

    return (
      <div data-name={ dataName }>
        <AntAutoComplete { ...rest } />
        { error && <div className="error">{ error }</div> }
      </div>
    );
  }
}
