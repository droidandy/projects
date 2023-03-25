import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { extractFloat } from '@benrevo/benrevo-react-core';

class ItemValueTyped extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    benefits: PropTypes.string.isRequired,
  };

  render() {
    const { item, benefits } = this.props;
    let val = null;
    let typeToShow = '';
    switch (benefits) {
      case 'in':
        val = item.valueIn;
        typeToShow = 'typeIn';
        break;
      case 'out':
        val = item.valueOut;
        typeToShow = 'typeOut';
        break;
      default:
        val = item.value;
        typeToShow = 'type';
        break;
    }
    const newValue = (item[typeToShow] === 'DOLLAR' || item[typeToShow] === 'PERCENT') ? extractFloat(val)[0] : val;
    if (item[typeToShow] === 'NUMBER' || val === null) {
      return (
        <span>
          <span>
            {val}
          </span>
        </span>
      );
    }
    if (item[typeToShow] === 'DOLLAR') {
      return (
        <span>
          <FormattedNumber
            style="currency" // eslint-disable-line react/style-prop-object
            currency="USD"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
            value={newValue || 0}
          />
        </span>
      );
    } else if (item[typeToShow] === 'PERCENT' && val !== 'N/A') {
      return (
        <span>
          <FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            minimumFractionDigits={0}
            maximumFractionDigits={1}
            value={newValue ? newValue / 100 : 0}
          />
        </span>
      );
    }
    return (
      <span>
        <span>
          {val && val.length ? val : 'N/A'}
        </span>
      </span>
    );
  }
}

export default ItemValueTyped;
