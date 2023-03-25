import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from './Select';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    options: state.app.salesmen
  };
}

class SalesmanSelector extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
  };

  render() {
    const { value, options, ...rest } = this.props;

    return (
      <Select
        { ...rest }
        value={ value && value.toString() }
      >
        { options.map(opt => <Option key={ opt.id }>{ `${opt.firstName} ${opt.lastName}` }</Option>) }
      </Select>
    );
  }
}

export default connect(mapStateToProps)(SalesmanSelector);
