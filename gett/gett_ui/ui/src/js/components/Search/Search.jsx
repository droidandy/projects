import React, { PureComponent } from 'react';
import { Icon } from 'components';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import CN from 'classnames';

import css from './Search.css';

export default class Search extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Search'
  };

  clear = () => {
    this.props.onChange('');
  };

  onChange = (e) => {
    this.props.onChange(e.target.value, e);
  };

  render() {
    const { value, ...rest } = this.props;
    let suffix = null;
    const prefix = <Icon icon="Search" className="text-30 lh-0" color="#e2e2e2" />;
    
    if (value.length >= 1) {
      suffix = <Icon key="search" onClick={ this.clear } className={ CN('text-14 vertical-top mr-5 pointer', css.clearIcon) } icon="MdClose" />;
    }

    return (
      <Input.Search
        suffix={ suffix }
        prefix= { prefix }
        value={ value }
        { ...rest }
        onChange={ this.onChange }
      />
    );
  }
}
