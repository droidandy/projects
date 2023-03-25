import React from 'react';
import { ModalForm, Input, TextArea, AddressAutocomplete } from 'components/form';

export default class FavoriteAddressForm extends ModalForm {
  validations = {
    name: {
      presence: { message: 'Please add in a name for this favourite address' },
      length: { maximum: 32 }
    },
    address: {
      presence: { message: 'Please add in a name for this favourite address' },
      address: true
    },
    pickupMessage: { length: { maximum: 100 } },
    destinationMessage: { length: { maximum: 100 } }
  };

  $render($) {
    return (
      <div id={ this.componentName }>
        <Input { ...$('name') } label="Favorite Address Name" className="mb-20" labelClassName="required mb-5" />
        <AddressAutocomplete
          { ...$('address') }
          label="Favorite Address"
          className="mb-20"
          icon="GettDude"
          labelClassName="required mb-5"
          containerId={ this.componentName }
        />
        <TextArea
          { ...$('pickupMessage') }
          label="Pickup Message"
          className="mb-20"
          labelClassName="mb-5"
          rows={ 2 }
          maxLength="100"
        />
        <TextArea
          { ...$('destinationMessage') }
          label="Destination Message"
          className="mb-20"
          labelClassName="mb-5"
          rows={ 2 }
          maxLength="100"
        />
      </div>
    );
  }
}
