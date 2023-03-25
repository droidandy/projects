import React from 'react';
import { ModalForm, TextArea, Rate } from 'components/form';

export default class FeedbackForm extends ModalForm {
  validations = {
    rating: 'presence'
  };

  $render($) {
    return (
      <div>
        <Rate
          { ...$('rating') }
          label="Rating from 1 to 10 what was your overall experience of the service"
          labelClassName="mb-10"
          className="mb-20"
        />
        <TextArea
          { ...$('message') }
          label="Your feedback message"
          labelClassName="bold-text text-12 mb-10"
          rows={ 4 }
          maxLength="450"
        />
      </div>
    );
  }
}
