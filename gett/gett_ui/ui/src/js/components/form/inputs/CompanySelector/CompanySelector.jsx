import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '../Select';
import { filter, includes, map } from 'lodash';
import CN from 'classnames';

import css from './CompanySelector.css';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    options: state.app.companies
  };
}

class CompanySelector extends PureComponent {
  static propTypes = {
    onlyEnterprise: PropTypes.bool,
    onlyActive: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
  };

  state = {
    searchValue: ''
  };

  handleChange = (searchValue) => {
    this.setState({ searchValue }, () => {
      this.props.onChange(null);
    });
  };

  handleSelect = (value) => {
    this.setState({ searchValue: '' }, () => {
      this.props.onChange(value);
    });
  };

  // without this handler Select visually picks one of available options without triggering
  // onSelect event, resulting in value being null and option being visually selected
  handleBlur = () => {
    this.setState({ searchValue: '' });
  };

  filterOption = (inputValue, option) => {
    return includes(option.props.children.toLowerCase(), inputValue.toLowerCase());
  };

  renderOptions() {
    const { options, onlyEnterprise, onlyActive } = this.props;
    let filteredOptions = options;

    if (onlyEnterprise) {
      filteredOptions = filter(options, opt => opt.companyType !== 'affiliate');
    }

    if (onlyActive) {
      filteredOptions = filter(options, 'active');
    }

    return map(filteredOptions, opt => <Option key={ opt.id }>{ opt.name }</Option>);
  }

  render() {
    const { value, ...rest } = this.props;
    const { searchValue } = this.state;
    const inputValue = value || searchValue;

    return (
      <Select
        { ...rest }
        value={ inputValue && inputValue.toString() }
        onChange={ this.handleChange }
        onSelect={ this.handleSelect }
        onBlur={ this.handleBlur }
        filterOption={ this.filterOption }
        placeholder="Select company from list"
        allowClear
        showSearch
        combobox
        className= { CN({ [css.companySelector]: !inputValue }, rest.className) }
      >
        { this.renderOptions() }
      </Select>
    );
  }
}

export default connect(mapStateToProps)(CompanySelector);
