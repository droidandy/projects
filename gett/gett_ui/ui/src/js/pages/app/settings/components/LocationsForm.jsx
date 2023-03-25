import React from 'react';
import { ModalForm, Input, TextArea, AddressAutocomplete } from 'components/form';

export default class LocationsForm extends ModalForm {
  validations = {
    name: ['presence', { length: { maximum: 32 } }],
    address: ['presence', 'address'],
    pickupMessage: { length: { maximum: 100 } },
    destinationMessage: { length: { maximum: 100 } }
  };

  $render($) {
    return (
      <div id={ this.componentName }>
        <Input
          { ...$('name') }
          label="Office Location Name"
          className="mb-20"
          labelClassName="required mb-5"
        />
        <AddressAutocomplete
          { ...$('address') }
          label="Office Location Address"
          className="mb-20"
          labelClassName="required mb-5"
          containerId={ this.componentName }
        />
        <TextArea
          { ...$('pickupMessage') }
          label="Pickup message"
          className="mb-20"
          labelClassName="mb-5"
          rows={ 2 }
          maxLength="100"
        />
        <TextArea
          { ...$('destinationMessage') }
          label="Destination message"
          className="mb-20"
          labelClassName="mb-5"
          rows={ 2 }
          maxLength="100"
        />
      </div>
    );
  }
}
