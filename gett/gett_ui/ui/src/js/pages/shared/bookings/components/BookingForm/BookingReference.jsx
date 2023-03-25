import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, AutoComplete } from 'components/form';
import { isEmpty } from 'lodash';

export default class BookingReference extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    reference: PropTypes.object.isRequired,
    entries: PropTypes.array.isRequired,
    anyConditionalPresent: PropTypes.bool,
    onRequestEntries: PropTypes.func,
    onChange: PropTypes.func,
    className: PropTypes.string,
    costCentre: PropTypes.string,
    ownCostCentre: PropTypes.bool,
    dataName: PropTypes.string
  };

  requestEntries = (value) => {
    const { value: currentValue, reference, entries, onRequestEntries } = this.props;

    // onFocus event with some entries already loaded
    if (value === undefined && entries.length > 0) return;

    onRequestEntries(reference.id, value || currentValue || '');
  };

  useCostCentre = () => {
    if (this.props.anyConditionalPresent) return;

    this.props.onChange(this.props.costCentre);
  };

  renderReferenceLabel() {
    const { name, costCentre } = this.props.reference;

    return costCentre ? this.renderCostCentreLabel() : name;
  }

  renderCostCentreLabel() {
    const { ownCostCentre, costCentre } = this.props;

    if (isEmpty(costCentre)) return 'Cost Centre';

    return (
      <div className="layout horizontal center wrap">
        <div className="flex xs-full-width">Cost Centre</div>
        <a onClick={ this.useCostCentre }>Click here to use { ownCostCentre ? 'my' : 'passenger\'s' } Cost Centre</a>
      </div>
    );
  }

  render() {
    const {
      // eslint-disable-next-line no-unused-vars
      reference, entries, className, onRequestEntries, costCentre, ownCostCentre, anyConditionalPresent, dataName, ...rest
    } = this.props;

    if (reference.dropdown) {
      const values = entries.map(e => e.value);

      return (
        <div className={ className }>
          <label className="text-12 bold-text grey-text mb-5">{ reference.name }</label>
          <AutoComplete
            dataSource={ values }
            onSearch={ this.requestEntries }
            onFocus={ this.requestEntries }
            className="full-width"
            placeholder="Start typing.."
            dataName={ dataName }
            { ...rest }
          />
        </div>
      );
    } else {
      return (
        <Input
          className={ className }
          label={ this.renderReferenceLabel() }
          labelClassName="text-12 bold-text grey-text mb-5"
          { ...rest }
        />
      );
    }
  }
}
