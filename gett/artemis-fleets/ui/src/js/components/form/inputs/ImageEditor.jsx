import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Editor from 'components/ImageEditor';

export default class ImageEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { name, value, error, onChange, ...rest } = this.props;

    return <Editor imageUrl={ value } onApply={ onChange } { ...rest } />;
  }
}
