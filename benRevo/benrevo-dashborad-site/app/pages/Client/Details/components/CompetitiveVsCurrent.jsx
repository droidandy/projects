import React from 'react';
import PropTypes from 'prop-types';
import Ruler from './Ruler';
import TwoRuler from './TwoRuler';

class CompetitiveVsCurrent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clients: PropTypes.array.isRequired,
    client: PropTypes.object.isRequired,
  };

  render() {
    const { clients, client } = this.props;
    let value = 0;
    let optionReleasedFlag = false;
    let renewalValue = -Infinity;
    const settings = {
      values: [],
      above: [],
      less: [],
      minVal: 0,
      maxVal: 0,
    };
    clients.forEach((item) => {
      if (item.clientId === client.clientId) {
        const val = parseFloat(item.competitiveVsCurrent);
        settings.values.push(val);
        if (val < 0) {
          settings.less.push(val);
        }
        if (val > 0) {
          settings.above.push(val);
        }
      }
    });
    settings.less = settings.less.sort((a, b) => a - b).reverse();
    settings.above = settings.above.sort((a, b) => a - b).reverse();
    const clearValues = settings.values.filter((setting) => {
      if (!isNaN(setting)) {
        return setting;
      }
      return false;
    });
    settings.minVal = Math.min.apply(null, clearValues);
    settings.maxVal = Math.max.apply(null, clearValues);
    // console.log('client.differences = ', client.differences);
    const maxVal = Math.max.apply(null, [Math.abs(settings.maxVal), Math.abs(settings.minVal)]);
    const diffArr = [];
    const renewalArr = [];
    let absDiffs = [];
    let startingValue = -Infinity;
    if (client.differences && client.differences.length) {
      client.differences.forEach((item) => {
        if (item.type === 'COMPETITIVE_INFO') {
          const elem = parseFloat(item.value);
          diffArr.push(elem);
          absDiffs.push(Math.abs(elem));
        } else if (item.type === 'OPTION1_RELEASED') {
          value = item.value;
          optionReleasedFlag = true;
        } else if (item.type === 'RENEWAL_ADDED') {
          const elem = parseFloat(item.value);
          // renewalArr.push(elem);
          absDiffs.push(Math.abs(elem));
          renewalValue = item.value;
        } else if (item.type === 'INITIAL_RENEWAL') {
          startingValue = item.value;
          if (renewalValue === -Infinity) {
            // renewalValue = startingValue if no renewal_added
            renewalValue = item.value;
          }
        }
      });
    }
    absDiffs = absDiffs.concat(Math.abs(value));
    if (renewalValue !== -Infinity) {
      absDiffs = absDiffs.concat(Math.abs(renewalValue));
    }
    const maxDiffValue = Math.max.apply(null, absDiffs);
    const realValue = Math.max.apply(null, [maxDiffValue, maxVal]);
    // console.log('maxDiffValue = ', maxDiffValue, 'realValue = ', realValue);
    // console.log('value = ', value, 'client.differences = ', client.differences, 'maxVal = ', maxVal, 'diffArr = ', diffArr, 'absDiffs = ', absDiffs);
    // only renewal clients see only renewal details
    if (startingValue === -Infinity) {
      startingValue = renewalValue;
    }
    const noRenewalData = renewalValue === -Infinity;
    if (!noRenewalData) {
      const renewalMaxVal = Math.max(startingValue, realValue);
      const renewalMinVal = Math.min.apply(null, diffArr.concat([startingValue, realValue]));
      return (
        <div className="competitive-current">
          <TwoRuler startValue={parseFloat(startingValue)} minVal={renewalMinVal} maxVal={renewalMaxVal} differences={diffArr} renewal={renewalArr} value={parseFloat(renewalValue)} settings={settings} />
        </div>
      );
    } else if (noRenewalData && optionReleasedFlag) {
      return (
        <div className="competitive-current">
          <Ruler maxVal={realValue} differences={diffArr} renewal={renewalArr} value={parseFloat(value)} settings={settings} />
        </div>
      );
    }
    return null;
  }
}

export default CompetitiveVsCurrent;
