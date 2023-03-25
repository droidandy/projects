import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import Select from './Select';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    options: state.companies.form.users
  };
}

class UserSelector extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
  };

  filterPassengerOption = (inputValue, option) => {
    return includes(option.props.children.toLowerCase(), inputValue.toLowerCase());
  };

  onChange = () => {
    if (typeof this.props.value !== Number) this.props.onChange('');
  };

  render() {
    const { value, options, onChange, ...rest } = this.props;

    return (
      <Select
        { ...rest }
        showSearch
        defaultActiveFirstOption={ false }
        filterOption={ this.filterPassengerOption }
        value={ value || '' }
        onSelect={ onChange }
        onChange={ this.onChange }
      >
        { options.map(opt => <Option key={ opt.id }>{ `${opt.firstName} ${opt.lastName}` }</Option>) }
      </Select>
    );
  }
}

export default connect(mapStateToProps)(UserSelector);
