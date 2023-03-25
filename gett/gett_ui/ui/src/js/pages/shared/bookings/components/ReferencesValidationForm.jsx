import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components';
import Form from 'components/form';
import BookingReference from './BookingForm/BookingReference';
import { isEmpty, some } from 'lodash';

export default class ReferencesValidationForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    bookingReferences: PropTypes.array,
    referenceEntries: PropTypes.object,
    onRequestReferenceEntries: PropTypes.func
  };

  validate($v) {
    super.validate($v);

    this.each('bookerReferences', (ref, i) => {
      if (ref.conditional && !this.anyConditionalPresent()) {
        $v.addError(`bookerReferences.${i}.value`, 'fill at least one of these fields');
      }

      if (ref.mandatory && isEmpty(ref.value)) {
        $v.addError(`bookerReferences.${i}.value`, 'is not present');
      }
    });

    return $v.errors;
  }

  anyConditionalPresent() {
    return some(this.get('bookerReferences'), ref => ref.conditional && !isEmpty(ref.value));
  }

  save = this.save.bind(this);

  $render($) {
    const { bookingReferences, referenceEntries, onRequestReferenceEntries } = this.props;

    return (
      <div className="half-width center-block p-20">
        <div className="text-18 bold-text mb-20 text-center">
          Please Validate Reference(s) before placing Order(s)
        </div>
        <div className="bold-text" data-name="bookingReferences">
          { bookingReferences.length > 0 &&
            this.map('bookerReferences', (ref, i) => (
              <BookingReference
                key={ i }
                { ...$(`bookerReferences.${i}.value`) }
                reference={ bookingReferences[i] }
                entries={ referenceEntries[bookingReferences[i].id] || [] }
                anyConditionalPresent={ this.anyConditionalPresent() }
                className="mb-20"
                onRequestEntries={ onRequestReferenceEntries }
                disabled={ ref.conditional && isEmpty(ref.value) && this.anyConditionalPresent() }
              />
            ))
          }
        </div>
        { !isEmpty(this.getErrors()) &&
          <div className="text-16 red-text bold-text text-center mb-20">
            We are sorry but references are not validated. Bookings not allowed
          </div>
        }
        <div className="text-center">
          <Button type="primary" onClick={ this.save }>
            Continue
          </Button>
        </div>
      </div>
    );
  }
}
