import React from 'react';
import PropTypes from 'prop-types';
import Form from 'components/form';
import BookingReference from './BookingReference';
import { isEmpty, some } from 'lodash';

export default class BookingReferencesForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    bookingReferences: PropTypes.arrayOf(PropTypes.object),
    referenceEntries: PropTypes.object,
    costCentre: PropTypes.string,
    ownCostCentre: PropTypes.bool,
    onRequestReferenceEntries: PropTypes.func
  };

  validate(validator) {
    this.each('bookerReferences', (ref, i) => {
      if (ref.conditional && !this.anyConditionalPresent()) {
        validator.addError(`bookerReferences.${i}.value`, 'fill at least one of these fields');
      }

      if (ref.mandatory && isEmpty(ref.value)) {
        validator.addError(`bookerReferences.${i}.value`, 'is not present');
      }
    });

    return validator.errors;
  }

  anyConditionalPresent() {
    return some(this.get('bookerReferences'), ref => ref.conditional && !isEmpty(ref.value));
  }

  $render($) {
    const {
      bookingReferences,
      referenceEntries,
      passengerCostCentre,
      ownCostCentre,
      onRequestReferenceEntries
    } = this.props;

    return (
      <div data-name="bookingReferences">
        <div className="pl-30 pr-20 pt-30 xs-pl-20 black-text text-16 light-text">Booking References</div>
        <div className="pt-20 pr-30 pl-30 xs-p-20">
          { this.map('bookerReferences', (ref, i) => (
              <BookingReference
                key={ i }
                { ...$(`bookerReferences.${i}.value`) }
                costCentre={ passengerCostCentre }
                ownCostCentre={ ownCostCentre }
                reference={ bookingReferences[i] }
                entries={ referenceEntries[bookingReferences[i].id] || [] }
                anyConditionalPresent={ this.anyConditionalPresent() }
                className="mb-30"
                onRequestEntries={ onRequestReferenceEntries }
                disabled={ ref.conditional && isEmpty(ref.value) && this.anyConditionalPresent() }
                dataName={ `bookerReferences.${i}.value` }
              />
            ))
          }
        </div>
        <div className="full-width pl-30 pr-30 xs-pl-20">
          <div className="border-bottom" />
        </div>
      </div>
    );
  }
}
